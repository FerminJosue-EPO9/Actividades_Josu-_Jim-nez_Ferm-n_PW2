#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Keypad.h>
#include <EEPROM.h>
#include <SPI.h>
#include <LoRa.h>
#include <avr/wdt.h> // 🟢 LIBRERÍA OBLIGATORIA PARA SISTEMAS 24/7

// ==================== CONFIGURACIONES ==================== //
#define LORA_SS    10
#define LORA_RST   9
#define LORA_DIO0  2
#define FREQ       433E6

// EEPROM
#define ADDR_DISTANCIA1 0
#define ADDR_DISTANCIA2 2
#define ADDR_FLAG_INIT 4
#define NO_INICIALIZADO 255
#define INICIALIZADO 123

// LCD y Teclado
LiquidCrystal_I2C lcd(0x27, 16, 2);
const byte ROWS = 4, COLS = 4;
char keys[ROWS][COLS] = {
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'}
};
byte rowPins[ROWS] = {A0, A1, A2, A3};
byte colPins[COLS] = {4, 5, 6, 7};
Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);

// ==================== VARIABLES ==================== //
int distanciaCisterna = 0;
int distanciaRotoplas = 0;
int lecturaCisterna = 0;
int lecturaRotoplas = 0;
int porCisterna = 0;
int porRotoplas = 0;

bool sistemaNuevo = true;
bool encendidoBomba = false;

// ==================== PROTOTIPOS ==================== //
void r_total();
void r_parcial();
void recibirDatosLoRa();
int pedirAltura(const char* texto); // Cambiado a char*
String tecladoEntrada(); // Se mantiene String solo para UI humana (lento y poco frecuente)
bool tecladoConfirmacion();
void procesarTecla(char tecla);
void enviarEstadoBombaM3(bool estado);

// ==================== SETUP ==================== //
void setup() {
  Serial.begin(9600);

  lcd.init();
  lcd.backlight();
  lcd.clear();

  LoRa.setPins(LORA_SS, LORA_RST, LORA_DIO0);
  if (!LoRa.begin(FREQ)) {
    lcd.print("Error LoRa!");
    while (1);
  }

  LoRa.setSpreadingFactor(12);
  LoRa.setSignalBandwidth(125E3);
  LoRa.setCodingRate4(5);
  LoRa.setSyncWord(0xF3);

  byte flag = EEPROM.read(ADDR_FLAG_INIT);
  if (flag == INICIALIZADO) {
    EEPROM.get(ADDR_DISTANCIA1, distanciaCisterna);
    EEPROM.get(ADDR_DISTANCIA2, distanciaRotoplas);
    sistemaNuevo = false;
  }

  lcd.print(sistemaNuevo ? "Nuevo sistema" : "Listo...");
  delay(1500);
  lcd.clear();

  // 🟢 ACTIVAR WATCHDOG (8 SEGUNDOS)
  // Si el Arduino se congela más de 8s, se reinicia solo.
  wdt_enable(WDTO_8S); 
}

// ==================== LOOP ==================== //
void loop() {
  wdt_reset(); // 🟢 Alimentar al perro guardián
  if (sistemaNuevo) {
    r_total();
  } else {
    r_parcial();
  }
}

// ==================== MODO CONFIGURACIÓN ==================== //
void r_total() {
  wdt_reset();
  lcd.clear();
  lcd.print("Config inicial");
  delay(1500);

  distanciaCisterna = pedirAltura("Altura cisterna");
  distanciaRotoplas = pedirAltura("Altura rotoplas");

  EEPROM.put(ADDR_DISTANCIA1, distanciaCisterna);
  EEPROM.put(ADDR_DISTANCIA2, distanciaRotoplas);
  EEPROM.write(ADDR_FLAG_INIT, INICIALIZADO);

  lcd.clear();
  lcd.print("Datos guardados");
  delay(1500);
  sistemaNuevo = false;
}

// ==================== MODO OPERATIVO ==================== //

void r_parcial() {
  lcd.clear();
  lcd.print("Roto:Cist:Bom:");

  unsigned long lastLoraCheck = 0;
  unsigned long lastLCDUpdate = 0;

  while (true) {
    wdt_reset(); // 🟢 Alimentar al perro CONSTANTEMENTE en este bucle
    
    // 1️⃣ Verificar LoRa cada 50ms (más rápido para no saturar buffer)
    if (millis() - lastLoraCheck >= 50) {
      recibirDatosLoRa(); 
      lastLoraCheck = millis();
    }

    // 2️⃣ Actualizar LCD cada 300ms
    if (millis() - lastLCDUpdate >= 300) {
      lcd.setCursor(0, 1);
      lcd.print("                ");
      lcd.setCursor(0, 1);
      lcd.print(porRotoplas);
      lcd.print("%");
      lcd.setCursor(6, 1);
      lcd.print(porCisterna);
      lcd.print("%");
      lcd.setCursor(12, 1);
      lcd.print(encendidoBomba ? "Si" : "No");
      lastLCDUpdate = millis();
    }

    // 3️⃣ Teclado sin bloqueo
    char tecla = keypad.getKey();
    if (tecla != NO_KEY) {
      procesarTecla(tecla);
      // Salir del bucle para volver a entrar y limpiar pantalla si es necesario
      // O simplemente continuar. En tu lógica original hacías break, 
      // lo cual te saca a loop() y vuelve a entrar a r_parcial(). Es válido.
      break; 
    }
  }
}

// ==================== RECEPCIÓN LORA (OPTIMIZADA) ==================== //

void recibirDatosLoRa() {
  int packetSize = LoRa.parsePacket();
  if (packetSize == 0) return; 

  Serial.print("\n📦 Paquete detectado: ");

  // 🟢 USO DE BUFFER (C-String) EN LUGAR DE STRING OBJECT
  char packetBuffer[64]; // Buffer fijo seguro
  int index = 0;
  
  while (LoRa.available() && index < 63) {
    packetBuffer[index] = (char)LoRa.read();
    index++;
  }
  packetBuffer[index] = '\0'; // Terminar la cadena correctamente

  Serial.println(packetBuffer); // Imprimir el char array

  // 🟢 PARSING CON FUNCIONES DE C (Más ligero y estable)
  if (index > 0) {
    bool datosActualizados = false;
    
    // Usamos strstr para buscar patrones en lugar de startsWith
    if (strstr(packetBuffer, "M1>M4:") == packetBuffer) { // Si empieza con esto
      // Extraer número (puntero + 6 caracteres)
      lecturaCisterna = atoi(packetBuffer + 6); 
      Serial.print("Cisterna actualizada: ");
      Serial.println(lecturaCisterna);
      datosActualizados = true;
    }
    else if (strstr(packetBuffer, "M2>M4:") == packetBuffer) {
      lecturaRotoplas = atoi(packetBuffer + 6);
      Serial.print("Rotoplas actualizado: ");
      Serial.println(lecturaRotoplas);
      datosActualizados = true;
    }
    else {
      Serial.println("Mensaje no reconocido");
    }

    // Recalcular porcentajes
    if (distanciaCisterna > 0 && lecturaCisterna > 0) {
      long calculo = (long)lecturaCisterna * 100 / distanciaCisterna; // Cast a long para evitar overflow intermedio
      porCisterna = 100 - (int)calculo;
      porCisterna = constrain(porCisterna, 0, 100);
    }
    if (distanciaRotoplas > 0 && lecturaRotoplas > 0) {
      long calculo = (long)lecturaRotoplas * 100 / distanciaRotoplas;
      porRotoplas = 100 - (int)calculo;
      porRotoplas = constrain(porRotoplas, 0, 100);
    }

    // LÓGICA DE BOMBA
    if (datosActualizados) {
      bool nuevoEstado = encendidoBomba;

      if (lecturaCisterna <= (distanciaCisterna - 6) && porRotoplas < 25) { //El porcentaje del rotoplas debe ser menor del 25% y la cisterna debe tener al menos 6 cm. de agua
        nuevoEstado = true;
      }
      else if (lecturaRotoplas <= 8 || lecturaCisterna >= (distanciaCisterna - 6)) {
        nuevoEstado = false;
      }

      if (nuevoEstado != encendidoBomba) {
        encendidoBomba = nuevoEstado;
        Serial.print("🔄 Cambio detectado - ");
      } else {
        Serial.print("🔄 Estado mantenido - ");
      }
      
      Serial.println(encendidoBomba ? "ENCENDER" : "APAGAR");
      enviarEstadoBombaM3(encendidoBomba);
    }
  }
}

// ==================== TECLADO FUNCIONES ==================== //
String tecladoEntrada() {
  String temp = "";
  char key;
  while (true) {
    wdt_reset(); // 🟢 Importante resetear aquí porque es un bucle while(true)
    key = keypad.getKey();
    if (key) {
      if (key == '#') return temp;
      else if (key == '*') {
        if (temp.length() > 0) temp.remove(temp.length() - 1);
      } else if (isdigit(key)) {
        temp += key;
      }
      lcd.setCursor(0, 1);
      lcd.print("                ");
      lcd.setCursor(0, 1);
      lcd.print(temp);
    }
    delay(50);
  }
}

bool tecladoConfirmacion() {
  lcd.setCursor(0, 1);
  lcd.print("*=No #=Si");
  while (true) {
    wdt_reset(); // 🟢 Resetear WDT
    char key = keypad.getKey();
    if (key == '#') return true;
    if (key == '*') return false;
  }
}

int pedirAltura(const char* texto) {
  int altura = 0;
  bool confirmado = false;

  while (!confirmado) {
    wdt_reset(); // 🟢 Resetear WDT
    lcd.clear();
    lcd.print(texto);
    lcd.setCursor(0, 1);
    lcd.print("en cm:");

    String valor = tecladoEntrada(); // Aquí dentro ya hay wdt_reset

    lcd.clear();
    lcd.print(valor + " cm?");
    confirmado = tecladoConfirmacion(); // Aquí dentro ya hay wdt_reset

    if (confirmado) altura = valor.toInt();
  }

  return altura;
}

// ==================== TECLAS ESPECIALES ==================== //
void procesarTecla(char tecla) {
  wdt_reset(); // Resetear antes de entrar a procesos lentos
  switch (tecla) {
    case 'A':
      lcd.clear();
      lcd.print("Cis:");
      lcd.print(distanciaCisterna);
      lcd.setCursor(0, 1);
      lcd.print("Roto:");
      lcd.print(distanciaRotoplas);
      delay(3000); // 3 segundos es seguro (WDT es 8s)
      break;

    case 'C':
      lcd.clear();
      lcd.print("Reinicio parcial");
      delay(1500);
      break;

    case 'D':
      lcd.clear();
      lcd.print("Reinicio total?");
      if (tecladoConfirmacion()) {
        for (int i = 0; i < EEPROM.length(); i++) EEPROM.write(i, 0);
        sistemaNuevo = true;
        lcd.clear();
        lcd.print("Reiniciando...");
        delay(1500);
        // Al salir, el loop() llamará a r_total()
      }
      break;

    default:
      lcd.clear();
      lcd.print("Tecla:");
      lcd.print(tecla);
      delay(800);
      break;
  }
}

// ==================== ENVÍO LORA ==================== //

void enviarEstadoBombaM3(bool estado) {
  wdt_reset(); 
  Serial.print("🔄 Intentando enviar a M3: ");
  Serial.println(estado ? "ON" : "OFF");

  LoRa.idle(); 
  delay(20);

  LoRa.beginPacket();
  LoRa.print("M4>M3:");
  LoRa.print(estado ? "ON" : "OFF");
  LoRa.endPacket(true); 
  LoRa.receive();      

  Serial.println("✅ Paquete enviado");
}