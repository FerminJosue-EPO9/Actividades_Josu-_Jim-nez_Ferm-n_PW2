// Programa: Prueba de salida digital en pin 8
// Autor: ChatGPT & Josué 😎

int pinSalida = 8;  // puedes cambiarlo al pin que uses para tu relé

void setup() {
  pinMode(pinSalida, OUTPUT);  // Configura el pin como salida
}

void loop() {
  digitalWrite(pinSalida, HIGH);  // Enciende el pin (5V)
  delay(1000);                    // Espera 1 segundo
  digitalWrite(pinSalida, LOW);   // Apaga el pin (0V)
  delay(1000);                    // Espera 1 segundo
}
