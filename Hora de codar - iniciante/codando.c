#include <stdio.h>

int main (){
    int idade, matricula;
    float altura;
    char nome[50];

    printf("Digite a sua idade: \n");
    scanf("%d", &idade);

    printf("Digite a sua altura: \n");
    scanf("%f", &altura);

    printf("Digite o seu nome: \n");
    scanf("%s", &nome);

    printf("Digite a sua matricula: \n");
    scanf("%d", &matricula);

    printf("O nome do aluno é: %s- A sua matricula é: %d\n", nome, matricula);
    printf("A sua idade é: %d - Altura %f", idade, altura);


    return 0;


}