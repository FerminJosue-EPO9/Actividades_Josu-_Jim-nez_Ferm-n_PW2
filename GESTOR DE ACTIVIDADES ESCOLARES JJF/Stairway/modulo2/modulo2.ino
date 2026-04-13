#include <SPI.h>
#include <LoRa.h>

int distance = 0;
const byte MY_ADDRESS = 2;  // M1=1, M2=2
// Pines del sensor HC-SR04
const int trigPin = 5;
const int echoPin = 4;

void setup() {
  Serial.begin(9600);
  while (!Serial);

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  if (!LoRa.begin(433E6)) {
    Serial.println("Starting LoRa failed!");
    while (1);
  }
    LoRa.setSpreadingFactor(12);
    LoRa.setSignalBandwidth(125E3);
    LoRa.setCodingRate4(5);
    LoRa.setSyncWord(0xF3);
}

void loop() {

  // MEDIR DISTANCIA
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  long duration = pulseIn(echoPin, HIGH, 30000);
  distance = duration * 0.0343 / 2;

    // MANDAR DISTANCIA
  
  Serial.println("Enviando la distancia: ");
  Serial.println(distance);
  
  LoRa.beginPacket();
  LoRa.print("M2>M4:");
  LoRa.print(distance);
  LoRa.endPacket();

  Serial.println("Lectura enviada correctamente.");

  delay(6300);
}
