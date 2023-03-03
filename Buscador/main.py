import warnings
import requests
import requests_cache
from bs4 import BeautifulSoup
from urllib3.exceptions import InsecureRequestWarning

warnings.filterwarnings('ignore', category=InsecureRequestWarning)
requests_cache.install_cache('banco')

def mostrar_dicionario_ordenado(dicionario):
    print('\n[!] RANK')

    index = 1
    for chave, valor in sorted(dicionario.items(), key=lambda item: item[1], reverse=True):
        print(f"{index}º: '{chave}' -> {valor:.0f}")
        
        index += 1

rank = {} # dicionário com os seguintes campos: {site: quantidade_de_ocorrencias}
ocorrencias = []
qtd_ocorrencias = 0

def verificar_ocorrencias(texto, termo, url):
    posicao = texto.find(termo)
    rank[url] += 1 # critério positivo de referência
    rank[url] -= len(url) / 10 # critério negativo de tamanho da url

    if posicao != -1: rank[url] = 0 # caso encontre pelo menos uma ocorrência, adicione no rank

    while posicao != -1:
        inicio = max(0, posicao - 20)
        fim = min(len(texto), posicao + len(termo) + 20)

        global qtd_ocorrencias
        qtd_ocorrencias += 1
        if texto[inicio:fim].replace('\n', '') not in ocorrencias:
            ocorrencias.append(texto[inicio:fim].replace('\n', '')) # guarda o trecho da ocorrência removendo quebras de linha

        rank[url] += 1 # critério positivo de ocorrências encontradas na página
        posicao = texto.find(termo, posicao + 1)

def busca(termo, url, profundidade):
    rank[url] = 0 # adiciona a página no ranqueamento
    resposta = requests.get(url, allow_redirects=True, verify=False) # 200 -> sucesso
    print(f'> {url}')

    soup = BeautifulSoup(resposta.content, 'html.parser')
    texto = soup.get_text()
    verificar_ocorrencias(texto, termo, url)
    
    if profundidade > 0:
        resposta = BeautifulSoup(resposta.text, 'html5lib')
        links = resposta.find_all('a', href=True)

        # itera em todos os links da página
        for link in links:
            # tratamento no link para transformar '/t/music/' -> 'https://reddit.com/t/music'
            link = link['href']
            if link[:4] != 'http':
                link = url + link

            if link in rank:
                continue

            busca(termo, link, profundidade - 1)

def main():  
    url = input('URL: ')
    termo = input('Termo a ser buscado: ')
    profundidade = int(input('Profundidade: '))
    print()

    busca(termo, url, profundidade)

    menu = '\n-------------- MENU --------------\n\n'
    menu += '1. Mostrar ocorrências\n'
    menu += '2. Mostrar rank\n'
    menu += '\n0. Sair\n'

    print(menu)
    opcao = int(input('> '))
    
    while opcao != 0:
        if opcao == 1:
            for ocorrencia in ocorrencias:
                print(ocorrencia)

            print(f"\n - Total de {len(ocorrencias)} ocorrências.")

        elif opcao == 2:
            mostrar_dicionario_ordenado(rank)

        print(menu)
        opcao = int(input('> '))

if __name__ == '__main__':
    main()
