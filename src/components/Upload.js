import { Component } from 'react';
import CryptoJS from 'crypto-js';


//////////////////////////////
const HOST = 'tj.file.myqcloud.com';
const APP_ID =  '1253506474';
const SECRET_ID =  'AKIDXu1sTpDlLeuwjHPgV4OSFl14qMcdCt76';
const SECRECT_Key =  'ta1D9pEMEpAE1XnmVyA5lCOQDn7C2i8J';
const BUCKET =  'dr';
/////////////////////////////

class Upload extends Component {

    getSignature( fileName = '' ) {
        let random = Math.floor( Math.random() * 10E8 );
        let time = parseInt( new Date().getTime() / 1000, 10 );
        let expireTime = fileName ? 60 + time : 0;
        let signature = `a=${APP_ID}&b=${BUCKET}&k=${SECRET_ID}&e=${expireTime}&t=${time}&r=${random}&f=${fileName}`;
        
        let hamcWordArray = CryptoJS.HmacSHA1(SECRECT_Key, signature);
        let originWordArray = CryptoJS.enc.Utf8.parse(signature);
        return CryptoJS.enc.Base64.stringify( hamcWordArray.concat(originWordArray) );
    }

    getImages() {
        let authKey = this.getSignature();
        let myHeaders = new Headers();
        myHeaders.append('Host', HOST);
        myHeaders.append('Authorization', authKey);

        console.log( authKey );
        // let authKey = 'authorization: esvlre2Kjh90Cr6LgMxfHeiQ575hPTEyNTM1MDY0NzQmYj1kciZrPUFLSURRangwdmZ6SHVNYmhiT3pzYjhJTEk0ZjRHSkRycmJqcCZlPTE0OTg2NTEzNzguNDIzJnQ9MTQ5ODY0NDE3OC40MjMmcj0yNzc1ODY0NzYmZj0=';
        fetch(`http://api1.fun.tv/api/get_message?isajax=1&dtime=1498648318985`, {
            method: 'GET',
            headers: myHeaders
        }).then( res => {
            return res.json();
        }).then( json => {
            console.log('文件列表--->', json);
        });
    }

    uploadImage(obj) {
        //todo: 判断是否超过20M
        // let {mime, path, width, height } = image;
        // let fileName = path.split('/').pop();
        let fileName = 'abcd.jpg';
        let authKey = this.getSignature();

        let form = new FormData();
        form.append('op', 'upload');
        form.append('filecontent', obj.data);
        // form.append('biz_attr', ['w=' + width, 'h=' + height].join('&'));

        fetch(`http://${HOST}/files/v2/${APP_ID}/${BUCKET}/${fileName}`, {
            method: 'POST',
            headers: {
                'Host': HOST,
                'Authorization': authKey
            },
            body: form
        }).then( res => {
            return res.json();
        }).then( json => {
            console.log('文件上传结果--->', json);
        });
    }
	render() {
		return null;
    }
}

export default Upload;