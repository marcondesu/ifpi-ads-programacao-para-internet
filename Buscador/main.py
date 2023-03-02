import requests
import requests_cache
from bs4 import BeautifulSoup

requests_cache.install_cache('banco')

def mostrar_dicionario_ordenado(dicionario):
    print('\n[!] RANK')

    index = 1
    for chave, valor in sorted(dicionario.items(), key=lambda item: item[1], reverse=True):
        print(f"{index}º: '{chave}' -> {valor}")
        
        index += 1

def busca(termo, url, profundidade):
    rank = {url: 0} # dicionário com os seguintes campos: {site: quantidade_de_ocorrencias}
    resposta = requests.get(url, verify=False)
    soup = BeautifulSoup(resposta.content, 'html.parser')
    texto = soup.get_text()

    posicao = texto.find(termo)

    while posicao != -1:
        inicio = max(0, posicao - 20)
        fim = min(len(texto), posicao + len(termo) + 20)
        # print(f'## {texto[inicio:fim]}')

        rank[url] += 1 # incrementa a quantidade de ocorrências
        posicao = texto.find(termo, posicao + 1)
    
    while profundidade > 0:
        html = BeautifulSoup(resposta.text, 'html5lib')
        links = html.find_all('a', href=True)

        # itera em todos os links da página
        for link in links:
            link = link['href']
                
            if (link[:1] == '/'):
                link = url + link

            # request da página
            response = requests.get(link, verify=False)
            root = BeautifulSoup(response.content, 'html.parser')
            texto = root.get_text()
            posicao = texto.find(termo)

            if posicao != -1: rank[link] = 0 # caso encontre pelo menos uma ocorrência, adicione no rank

            # printando todas ocorrências
            while posicao != -1:
                inicio = max(0, posicao - 20)
                fim = min(len(texto), posicao + len(termo) + 20)
                # print(f'## {texto[inicio:fim]}'.replace('\n', '')) # remove quebras de linha e printa a ocorrência

                rank[link] += 1 # incrementa a quantidade de ocorrências
                posicao = texto.find(termo, posicao + 1)
        
        profundidade -= 1

    mostrar_dicionario_ordenado(rank)

def main():  
    url = 'https://www.reddit.com'
    termo = input('Termo a ser buscado: ')
    profundidade = int(input('Profundidade: '))
    print()

    busca(termo, url, profundidade)

if __name__ == '__main__':
    main()
