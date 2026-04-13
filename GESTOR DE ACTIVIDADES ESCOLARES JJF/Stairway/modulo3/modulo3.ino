#include <SPI.h>
#include <LoRa.h>

#define activadorPin 4
boolean encenderBomba = false;

void setup() {
  Serial.begin(9600);
  while (!Serial);

  if (!LoRa.begin(433E6)) {
    Serial.println("Starting LoRa failed!");
    while (1);
  }
  LoRa.setSpreadingFactor(12);
  LoRa.setSignalBandwidth(125E3);
  LoRa.setCodingRate4(5);
  LoRa.setSyncWord(0xF3);

  pinMode(activadorPin, OUTPUT);
  Serial.println("M3 Listo - Esperando M4...");
}

void loop() {
  int packetSize = LoRa.parsePacket();
  if (packetSize) {
    Serial.print("Paquete recibido! Tamaño: ");
    Serial.println(packetSize);
    
    String message = "";
    unsigned long startTime = millis();
    
    // ⬇️ LEER CON TIMEOUT - igual que en M4
    while (LoRa.available() && (millis() - startTime < 100)) {
      message += (char)LoRa.read();
    }

    Serial.print("Mensaje completo: ");
    Serial.println(message);

    if (message.startsWith("M4>M3:")) {
      String dataBomba = message.substring(6); // "M4>M3:" tiene 6 caracteres
      Serial.print("Estado bomba: ");
      Serial.println(dataBomba);

      if (dataBomba.equals("ON")) {
        digitalWrite(activadorPin, HIGH);
        Serial.println("✅ Bomba ENCENDIDA");
      } else if (dataBomba.equals("OFF")) {
        digitalWrite(activadorPin, LOW);
        Serial.println("❌ Bomba APAGADA");
      } else {
        Serial.println("⚠️ Estado desconocido");
      }
    }
  }
  
  // ⬇️ PEQUEÑO DELAY para no saturar
  delay(50);
}
