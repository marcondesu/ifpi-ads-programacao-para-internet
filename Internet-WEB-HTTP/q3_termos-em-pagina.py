import requests
import requests_cache
from bs4 import BeautifulSoup

def vetor_para_texto(vetor):
    texto = ''
    index = 0

    while index < len(vetor):
        if (index == len(vetor) - 1):
            texto += vetor[index]
        else:
            texto += vetor[index] + ' '

        index += 1

    return texto

# função nada elegante utilizada para remover espaços desnecessários e caracteres especiais, caso contrário não seria possível encontrar uma palavra que antecede uma vírgula, ponto final e etc
def split_caracteres_especiais(texto):
    texto = texto.split('\n')
    texto = vetor_para_texto(texto)
    texto = texto.split(' ')
    texto = vetor_para_texto(texto)
    texto = texto.split(', ')
    texto = vetor_para_texto(texto)
    texto = texto.split('. ')
    texto = vetor_para_texto(texto)
    texto = texto.split(': ')
    texto = vetor_para_texto(texto)
    texto = texto.split('; ')
    texto = vetor_para_texto(texto)
    texto = texto.split('? ')
    texto = vetor_para_texto(texto)
    texto = texto.split('! ')
    texto = vetor_para_texto(texto)

    return texto

def indices_de_ocorrencia(texto, termo):
    texto = texto.split(' ')
    ocorrencias = []
    index = 0

    while index < len(texto):
        if texto[index] == termo:
            ocorrencias.append(index)

        index += 1

    return ocorrencias

def printar_ocorrencias(texto, termo, ocorrencias):
    for ocorrencia in ocorrencias:
        antes = ocorrencia - 20
        depois = ocorrencia + len(termo) + 20

        print(texto[antes:depois])

requests_cache.install_cache('banco')

print('Página que deseja buscar o termo')
pagina = input('> ')

response = requests.get(pagina, verify=False)
soup = BeautifulSoup(response.content, 'html.parser')

tag = soup.body
text = ''

for string in tag.strings:
    text += string

termo = 'of'
text = split_caracteres_especiais(text)
indices = indices_de_ocorrencia(text, termo)

printar_ocorrencias(text, termo, indices)
