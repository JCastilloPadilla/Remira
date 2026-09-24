# Resultados del modelo preentrenado

## Configuración del experimento

- Modelo: `cybersectony/phishing-email-detection-distilbert_v2.4.1`.
- Dataset de evaluación: `data/raw/CEAS_08.csv`.
- Tamaño de muestra: 100 correos.
- Selección: muestreo estratificado con semilla 42.
- Clase positiva: `malicious` (correos con `label = 1` en CEAS_08).

Esta evaluación no reentrena el modelo. CEAS_08 se utiliza únicamente para medir
cómo se comporta el modelo preentrenado con datos ajenos a su entrenamiento.
Es una corrida preliminar: 100 correos no son suficientes para declarar el
modelo validado ni para compararlo formalmente con otros modelos.

## Métricas

| Métrica | Resultado |
| --- | ---: |
| Accuracy | 0.8700 |
| Precision | 0.8909 |
| Recall | 0.8750 |
| F1-score | 0.8829 |

## Matriz de confusión

Filas: clase real. Columnas: predicción. El orden de clases es
`[legitimate, malicious]`.

```text
[38, 6]
[7, 49]
```

## Interpretación

La métrica más importante en este caso es el **recall** de la clase maliciosa:
indica qué proporción de los correos peligrosos fue detectada. Antes de usar el
modelo en una interfaz o como filtro, se debe repetir esta evaluación con una
muestra mayor y revisar manualmente falsos positivos y falsos negativos.
