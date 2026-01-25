#include <stdio.h>

int main (){
    int idade;
    float altura;
    char nome[20];

    printf("Digite a sua idade: ");
    scanf("%d", &idade);
    printf("A idade: %d\n", idade);

    printf("Digite a sua altura: ");
    scanf("%f", &altura);
    printf ("A altura é: %.2f\n", altura);

    printf("Digite o seu nome: ");
    scanf("%s", nome);
    printf("Seu nome é: %s\n", nome);

    return 0;

}