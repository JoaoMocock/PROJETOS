#include<stdio.h>

    int main() {
        char estado[20];
        char codigo[5];
        char cidade[20];
        int populacao[30];
        float area;
        int pontos;

        printf("Nome do estado: \n");
        scanf("%s", estado);

        printf("Código da cidade: \n");
        scanf("%s", codigo);

        printf("Nome da cidade: \n");
        scanf("%s", cidade);

        printf("População: \n");
        scanf("%d", &populacao[0]);

        printf("Area km2: \n");
        scanf("%f", &area);

        printf("Pontos: \n");
        scanf("%d", &pontos);

        char estado2[20];
        char codigo2[5];
        char cidade2[20];
        int populacao2[30];
        float area2;
        int pontos2;

        printf("Nome do estado: \n");
        scanf("%s", estado2);

        printf("Código da cidade: \n");
        scanf("%s", codigo2);

        printf("Nome da cidade: \n");
        scanf("%s", cidade2);

        printf("População: \n");
        scanf("%d", &populacao2[0]);

        printf("Area km2: \n");
        scanf("%f", &area2);

        printf("Pontos: \n");
        scanf("%d", &pontos2);

        printf("O número do primeiro estado é: %s\n", estado);
        printf("O código da primeira cidade é: %s\n", codigo);
        printf("O nome da primeiracidade é: %s\n", cidade);
        printf("A população da primeira cidade é: %d\n", populacao[0]);
        printf("A área em km2 é: %f\n", area);
        printf("A quantidade de pontos turisticos são: %d\n", pontos);

        printf("O número do segundo estado é: %s\n", estado2);
        printf("O código da segunda cidade é: %s\n", codigo2);
        printf("O nome da segunda cidade é: %s\n", cidade2);
        printf("A população da segunda cidade é: %d\n", populacao2[0]);
        printf("A área em km2 é: %f\n", area2);
        printf("A quantidade de pontos turisticos são: %d\n", pontos2);
        return 0;



    }