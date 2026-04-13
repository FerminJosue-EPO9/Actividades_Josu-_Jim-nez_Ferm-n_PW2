#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Keypad.h>
#include <EEPROM.h>

const byte ROWS = 4;
const byte COLS = 4;

char keys[ROWS][COLS] = {
  {'1','2','3','A'},
  {'4','5','6','B'},
  {'7','8','9','C'},
  {'*','0','#','D'}
};

byte rowPins[ROWS] = {A0, A1, A2, A3};  // Filas, los primeros 4 viendo hacía mi, 
                                        // el primero viendo hacia mi iría en el A0
byte colPins[COLS] = {4, 5, 6, 7};      // Columnas

Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);
LiquidCrystal_I2C lcd(0x27, 16, 2);

String Cadena = "";
int distanciaCisterna = 0;
int distanciaRotoplas = 0;
int lecturaCisterna = 77;
int lecturaRotoplas = 77;
boolean encendidoBomba = false;
boolean encenderBomba = false;
int porRotoplas = 0;
int porCisterna = 0;
boolean sistemaNuevo = true;

#define ADDR_DISTANCIA1 0    // 2 bytes para distancia1 (0-1000)
#define ADDR_DISTANCIA2 2    // 2 bytes para distancia2 (0-1000) 
#define ADDR_FLAG_INIT 4     // 1 byte para el flag de inicialización
#define NO_INICIALIZADO 255  // Valor por defecto de EEPROM
#define INICIALIZADO 123     // Valor que indica que ya se inicializó

void setup() {
  Serial.begin(9600);
  
  // Inicializar LCD
  lcd.init();
  lcd.backlight();  
  lcd.clear();

  // Iniciar y analizar memoria
  byte flag = EEPROM.read(ADDR_FLAG_INIT);

  if (flag == NO_INICIALIZADO) {
    sistemaNuevo = true;
  } else {
    sistemaNuevo = false;
    EEPROM.get(ADDR_DISTANCIA1, distanciaCisterna);
    EEPROM.get(ADDR_DISTANCIA2, distanciaRotoplas);
  }
  
}

void loop() {
  
  if (sistemaNuevo) {
    r_total();
  } else {
    r_parcial();
  }
  
}


void r_total() {
  lcd.clear();
  lcd.print("Bienvenido.");
  lcd.setCursor(0, 1);
  lcd.print("Por favor...");
  delay(3000);

  // Pedir altura de la cisterna
  distanciaCisterna = pedirAltura("Altura de cisterna");

  // Pedir altura del rotoplas
  distanciaRotoplas = pedirAltura("Altura de rotoplas");

  lcd.clear();
  lcd.print("Guardando");
  lcd.setCursor(0,1);
  lcd.print("distancias...");
  delay(2000);

  EEPROM.put(ADDR_DISTANCIA1, distanciaCisterna);
  EEPROM.put(ADDR_DISTANCIA2, distanciaRotoplas);
  EEPROM.write(ADDR_FLAG_INIT, INICIALIZADO); // marca como inicializado

  lcd.clear();
  lcd.print("Datos guardados.");
  delay(2000);

  sistemaNuevo = false; // para pasar a r_parcial()
  
}

String teclado() {
  String temp = "";
  char key = NO_KEY;

  while (true) {
    key = keypad.getKey();
    if (key != NO_KEY) {
      if (key == '*') {  // Backspace
        if (temp.length() > 0) temp.remove(temp.length() - 1);
      } else if (key >= '0' && key <= '9') {  // Números
        if (temp.length() < 14) temp += key;
      } else if (key == '#') {  // Terminar entrada
        return temp;
      }

      lcd.clear();
      lcd.print(temp);
    }
    delay(50);
  }
}

boolean tecladoConfirmacion() {
  char key = keypad.waitForKey();
  if (key == '#') return true;
  else return false;  // * = no
}

int pedirAltura(String texto) {
  int altura = 0;
  boolean confirmado = false;

  while (!confirmado) {
    lcd.clear();
    lcd.print(texto);       // Ej: "Altura de cisterna"
    lcd.setCursor(0, 1);
    lcd.print("en cm: Ingresar.");

    // Pedir la cadena al usuario
    String cadena = teclado();   // teclado() retorna String

    // Mostrar para confirmar
    lcd.clear();
    lcd.print(texto + ":");
    lcd.setCursor(0, 1);
    lcd.print(cadena + " cm? */#");

    // Confirmación
    confirmado = tecladoConfirmacion();
    if (!confirmado) {
      lcd.clear();
      lcd.print("Reingrese valor.");
      delay(1500);
    } else {
      altura = cadena.toInt(); // Convertir a número
    }
  }

  return altura;
}


void r_parcial(){

    lcd.clear();
    lcd.print("Datos");
    lcd.setCursor(0,1);
    lcd.print("recuperados.");
    delay(3000);
    lcd.clear();
    lcd.print("Hola");
    lcd.setCursor(0,1);
    lcd.print("de nuevo ^^.");
    delay(3000);

    lcd.clear();
    lcd.print("Roto: Cist: Bom:");
    
    char keyPressed = NO_KEY;
    
    while(keyPressed == NO_KEY){ // Mientras no haya errores o se presione una tecla mostrar las lecturas
        
    // Obtener lecturas vía Lora



    // Lecturas obtenidas vía Lora

    porCisterna = lecturaCisterna * 100 / distanciaCisterna;
    porRotoplas = lecturaRotoplas * 100 / distanciaRotoplas;
        
        lcd.setCursor(0,1);
        lcd.print(porRotoplas);
        lcd.print("%");
        lcd.setCursor(6,1);
        lcd.print(porCisterna);
        lcd.print("%");
        lcd.setCursor(12,1);
        if (encendidoBomba == true){
          lcd.print("Si.");
          } else {
            lcd.print("No.");
            }
            delay(10);
            keyPressed = keypad.getKey();

           //  Hay >= 6 cm de agua en la cisterna && el rotoplas es < 25%? 
            // Encender la bomba
              
           // La distancia entre el sensor y la lectura del rotoplas es de <= 8 || Hay < 10 cm agua en la cisterna?
            // Apagar la boma
            
      }
      
    procesarTecla(keyPressed);
  
  }

void procesarTecla(char tecla) {
    
    switch(tecla) {
      
        case 'A':
            
            lcd.clear();
            lcd.print("Cis: ");
            lcd.print(distanciaCisterna);
            lcd.print(" cm.");
            lcd.setCursor(0,1);
            lcd.print("Roto: ");
            lcd.print(distanciaRotoplas);
            lcd.print(" cm.");
            delay(5000);
            break;

    
        case 'C':
            lcd.clear();
            lcd.print("Reinicio");
            lcd.setCursor(0,1);
            lcd.print("parcial...");
            delay(5000);
            break;
            
        case 'D':
            lcd.clear();
            lcd.print("Reinicio total?");
            lcd.setCursor(0,1);
            lcd.print("*=No #=Si");
            
            if(tecladoConfirmacion()) {
                // Reinicio total - borrar EEPROM
                for(int i = 0; i < EEPROM.length(); i++) {
                    EEPROM.write(i, 0);
                }
                sistemaNuevo = true;
                lcd.clear();
                lcd.print("Reiniciando...");
                delay(2000);
                // NO llamar r_total() - el loop() lo hará automáticamente
            } else {
                lcd.clear();
                lcd.print("Cancelado.");
                delay(1500);
                // NO llamar r_parcial() - el loop() se encarga
            }
            break;
            
        default:
            // Para cualquier otra tecla, regresar al modo normal
            lcd.clear();
            lcd.print("Tecla:");
            lcd.setCursor(0,1);
            lcd.print(tecla);
            delay(1500);
            break;
    }
}
