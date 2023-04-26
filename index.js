//importação das dependencias
const express = require ('express');
const multer = require ('multer');
const fs = require ('fs');
const { Console } = require('console');

const app = express ();

app.use (express.json ());

app.use(express.urlencoded({ extended: true}));

/*configuração do multer*/

//configuração do storage 
const storage = multer.diskStorage(
    {
        //determina o destino do arquivo
        destination:(req, file, cb)=>{
            cb (null, './uploads') // .uploads' - determina o nome da pasta que vai estar o arquivo
        },
        //determina o nome do arquivo
        filename:(req, file, cb)=>{
            cb (null, Date.now().toString() + '_' + file.originalname) //numero da foto é gerado pelo date.now e string, gerando um nome 
        }
    }
);


//FILTER (opicional)
const fileFilter = (req, file, cb)=>{
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' ){
        //filefilter recebe uma requisição e uma callback

        cb(null, true);
} else {
        cb(null, false);
}
}


//UPLOAD
//depende do storage, limits (limite de tamanho do arquivo) e filterFile para poder funcionar, Configura no multer todas as regras de upload

const upload = multer(
    {
        storage:storage,
        limits:{
            filesize: 1024 * 1024 * 5 
        },
        fileFilter: fileFilter,
    }
);

/*ROTA POST DE UPLOAD*/

//array - dois ou mais arquivos
app.post ('/upload', upload.array('imagem', 2), (req, res)=>{
    //dados de texto
    console.log (req.files);
    console.log (req.body.nome);
    console.log (req.body.email);

    res.send('UPLOAD EFETUADO COM SUCESSO!');     
});
app.delete('/delete/:imagem', (req, res)=>{

    let {imagem} = req.params;
    let caminho = './uploads/' + imagem;

    //metodo unlink exclui os arquivos (exige o caminho dos arquivos e as ações que serão executadas)
    fs.unlink (caminho, (error)=>{
        if (error){
            res.send('ERRO AO EXCLUIR IMAGEM');
            console.log('ERROR:' + error)
        }
        else{
            res.send('IMAGEM EXCLUIDA COM SUCESSO!')
        }
    })
})

//criando requisições

app.listen(3000, ()=>{
    console.log ('SERVIDOR RODANDO EM http://localhost:3000');
}); 