#include <EEPROM.h>

void setup() {
  Serial.begin(9600);
  Serial.println("Iniciando borrado de EEPROM...");
  
  // Borrar toda la EEPROM escribiendo 0 en cada posición
  for (int i = 0; i < EEPROM.length(); i++) {
    EEPROM.write(i, 0);
  }
  
  // Especificamente borrar el flag de inicialización
  EEPROM.write(4, 255); // NO_INICIALIZADO
  
  Serial.println("EEPROM borrada exitosamente!");
  Serial.println("Ahora puedes subir tu proyecto principal.");
}

void loop() {
  // Nada que hacer aquí
}
