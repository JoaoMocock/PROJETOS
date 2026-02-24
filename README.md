/*
 * Super Trunfo - Comparação de Cartas de Países
 * Nível Intermediário: Menu interativo com switch e if-else aninhados
 */

#include <stdio.h>
#include <string.h>

int main() {
    /* -------------------------------------------------------
     * Dados das cartas (cadastro fixo do desafio anterior)
     * ------------------------------------------------------- */

    // Carta 1
    char pais1[50]       = "Brasil";
    int  populacao1      = 215000000;
    float area1          = 8515767.0f;
    float pib1           = 1920.0f;      // em bilhões de USD
    int  pontos1         = 12;
    float densidade1     = populacao1 / area1;  // hab/km²

    // Carta 2
    char pais2[50]       = "Japão";
    int  populacao2      = 125000000;
    float area2          = 377975.0f;
    float pib2           = 4230.0f;      // em bilhões de USD
    int  pontos2         = 20;
    float densidade2     = populacao2 / area2;  // hab/km²

    int opcao;

    /* -------------------------------------------------------
     * Exibição das cartas
     * ------------------------------------------------------- */
    printf("╔══════════════════════════════════════════════════╗\n");
    printf("║           SUPER TRUNFO - PAÍSES                 ║\n");
    printf("╠══════════════════════════════════════════════════╣\n");
    printf("║  CARTA 1: %-38s║\n", pais1);
    printf("║  CARTA 2: %-38s║\n", pais2);
    printf("╚══════════════════════════════════════════════════╝\n\n");

    /* -------------------------------------------------------
     * Menu de escolha do atributo
     * ------------------------------------------------------- */
    printf("Escolha o atributo para comparação:\n");
    printf("  1 - População\n");
    printf("  2 - Área (km²)\n");
    printf("  3 - PIB (bilhões USD)\n");
    printf("  4 - Pontos Turísticos\n");
    printf("  5 - Densidade Demográfica (menor vence)\n");
    printf("\nDigite sua opção: ");
    scanf("%d", &opcao);
    printf("\n");

    /* -------------------------------------------------------
     * Lógica de comparação com switch + if-else aninhados
     * ------------------------------------------------------- */
    switch (opcao) {

        case 1: {
            printf("⚔  Atributo: População\n");
            printf("   %s: %d hab\n", pais1, populacao1);
            printf("   %s: %d hab\n\n", pais2, populacao2);

            if (populacao1 > populacao2) {
                printf("🏆 Vencedor: %s!\n", pais1);
            } else if (populacao2 > populacao1) {
                printf("🏆 Vencedor: %s!\n", pais2);
            } else {
                printf("🤝 Empate!\n");
            }
            break;
        }

        case 2: {
            printf("⚔  Atributo: Área\n");
            printf("   %s: %.2f km²\n", pais1, area1);
            printf("   %s: %.2f km²\n\n", pais2, area2);

            if (area1 > area2) {
                printf("🏆 Vencedor: %s!\n", pais1);
            } else if (area2 > area1) {
                printf("🏆 Vencedor: %s!\n", pais2);
            } else {
                printf("🤝 Empate!\n");
            }
            break;
        }

        case 3: {
            printf("⚔  Atributo: PIB\n");
            printf("   %s: %.2f bilhões USD\n", pais1, pib1);
            printf("   %s: %.2f bilhões USD\n\n", pais2, pib2);

            if (pib1 > pib2) {
                printf("🏆 Vencedor: %s!\n", pais1);
            } else if (pib2 > pib1) {
                printf("🏆 Vencedor: %s!\n", pais2);
            } else {
                printf("🤝 Empate!\n");
            }
            break;
        }

        case 4: {
            printf("⚔  Atributo: Pontos Turísticos\n");
            printf("   %s: %d pontos\n", pais1, pontos1);
            printf("   %s: %d pontos\n\n", pais2, pontos2);

            if (pontos1 > pontos2) {
                printf("🏆 Vencedor: %s!\n", pais1);
            } else if (pontos2 > pontos1) {
                printf("🏆 Vencedor: %s!\n", pais2);
            } else {
                printf("🤝 Empate!\n");
            }
            break;
        }

        case 5: {
            printf("⚔  Atributo: Densidade Demográfica (MENOR vence)\n");
            printf("   %s: %.4f hab/km²\n", pais1, densidade1);
            printf("   %s: %.4f hab/km²\n\n", pais2, densidade2);

            // Regra invertida: menor densidade vence
            if (densidade1 < densidade2) {
                printf("🏆 Vencedor: %s!\n", pais1);
            } else if (densidade2 < densidade1) {
                printf("🏆 Vencedor: %s!\n", pais2);
            } else {
                printf("🤝 Empate!\n");
            }
            break;
        }

        default:
            printf("❌ Opção inválida! Escolha um número entre 1 e 5.\n");
            break;
    }

    printf("\n");
    return 0;
}
