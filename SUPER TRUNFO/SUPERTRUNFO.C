#include <stdio.h>

int main(void) {
    /*
     * Cadastro da Carta 1
     */
    char estado1[30];
    char codigo1[10];
    char cidade1[50];
    int populacao1;
    float area1;
    float pib1;
    int pontosTuristicos1;

    /*
     * Cadastro da Carta 2
     */
    char estado2[30];
    char codigo2[10];
    char cidade2[50];
    int populacao2;
    float area2;
    float pib2;
    int pontosTuristicos2;

    /* Entrada de dados da primeira carta */
    printf("=== Cadastro da Carta 1 ===\n");
    printf("Estado: ");
    scanf(" %29[^\n]", estado1);

    printf("Codigo da carta: ");
    scanf(" %9s", codigo1);

    printf("Nome da cidade: ");
    scanf(" %49[^\n]", cidade1);

    printf("Populacao: ");
    scanf(" %d", &populacao1);

    printf("Area (km2): ");
    scanf(" %f", &area1);

    printf("PIB: ");
    scanf(" %f", &pib1);

    printf("Numero de pontos turisticos: ");
    scanf(" %d", &pontosTuristicos1);

    /* Entrada de dados da segunda carta */
    printf("\n=== Cadastro da Carta 2 ===\n");
    printf("Estado: ");
    scanf(" %29[^\n]", estado2);

    printf("Codigo da carta: ");
    scanf(" %9s", codigo2);

    printf("Nome da cidade: ");
    scanf(" %49[^\n]", cidade2);

    printf("Populacao: ");
    scanf(" %d", &populacao2);

    printf("Area (km2): ");
    scanf(" %f", &area2);

    printf("PIB: ");
    scanf(" %f", &pib2);

    printf("Numero de pontos turisticos: ");
    scanf(" %d", &pontosTuristicos2);

    /*
     * Calculos solicitados
     * Densidade Populacional = Populacao / Area
     * PIB per capita = PIB / Populacao
     */
    float densidade1 = populacao1 / area1;
    float densidade2 = populacao2 / area2;

    float pibPerCapita1 = pib1 / populacao1;
    float pibPerCapita2 = pib2 / populacao2;

    printf("\n=== Dados calculados ===\n");
    printf("Carta 1 - %s (%s):\n", cidade1, estado1);
    printf("Densidade Populacional: %.2f\n", densidade1);
    printf("PIB per capita: %.2f\n", pibPerCapita1);

    printf("\nCarta 2 - %s (%s):\n", cidade2, estado2);
    printf("Densidade Populacional: %.2f\n", densidade2);
    printf("PIB per capita: %.2f\n", pibPerCapita2);

    /*
     * Atributo escolhido para comparacao (definido no codigo): Populacao
     * Regra: para populacao, vence a carta com maior valor.
     */
    printf("\nComparacao de cartas (Atributo: Populacao):\n");
    printf("Carta 1 - %s (%s): %d\n", cidade1, estado1, populacao1);
    printf("Carta 2 - %s (%s): %d\n", cidade2, estado2, populacao2);

    if (populacao1 > populacao2) {
        printf("Resultado: Carta 1 (%s) venceu!\n", cidade1);
    } else if (populacao2 > populacao1) {
        printf("Resultado: Carta 2 (%s) venceu!\n", cidade2);
    } else {
        printf("Resultado: Empate!\n");
    }

    /* Evita aviso de variavel nao utilizada em compiladores mais rigorosos */
    (void)codigo1;
    (void)codigo2;
    (void)pontosTuristicos1;
    (void)pontosTuristicos2;

    return 0;
}
