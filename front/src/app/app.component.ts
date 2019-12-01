import { Component } from '@angular/core';
import { Server, Network, Keypair, TransactionBuilder } from 'stellar-sdk';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
@Injectable()
export class AppComponent {
  title = 'webui';
  server = null;
  horizonAddress = 'https://horizon-testnet.stellar.org';
  showDeployNewSmartProgram = true;
  showWorkersList = false;
  smartAccountPublicKey = null;
  smartAccountPrivateKey = null;
  smartAccountCreatorSeed = null;
  workers = [];
  selected_workers = [
    {
      public_key: '',
      address: ''
    }
  ];

  constructor(private http: HttpClient) { }

  onSubmit() {

    (async function main() {
      smartAccountCreatorKeyPair = KeyPair.fromSecret(smartAccountCreatorSeed)

      var server = new Server(this.horizonAddress)

      smartAccountCreator = server.loadAccount(smartAccountCreatorKeyPair.address)
      const fee = await server.fetchBaseFee()
      new TransactionBuilder(smartAccountCreator, { fee })
    })()
  }

  generateNewKeyPair() {
    this.server = new Server('https://horizon.stellar.org');
    var keypair = Keypair.random();
    this.smartAccountPublicKey = keypair.publicKey();
    this.smartAccountPrivateKey = keypair.secret();
  }

  switchView(switchOption) {
    if (switchOption == 'showDeployNewSmartProgram') {
      this.showDeployNewSmartProgram = true;
      this.showWorkersList = false;
    }
    else if (switchOption == 'showWorkersList') {
      this.showDeployNewSmartProgram = false;
      this.showWorkersList = true;
      this.getWorkersList();
    }
  }

  getWorkersList() {
    this.http.get('http://localhost:3000/api/workers').subscribe((data: any[])=>{
      console.log(data);
      this.workers = data;
    })
  }

  copyMessage(val: string){
    let textarea = null;
    textarea = document.createElement("textarea");
    textarea.style.height = "0px";
    textarea.style.left = "-100px";
    textarea.style.opacity = "0";
    textarea.style.position = "fixed";
    textarea.style.top = "-100px";
    textarea.style.width = "0px";
    document.body.appendChild(textarea);
    // Set and select the value (creating an active Selection range).
    textarea.value = val;
    textarea.select();
    // Ask the browser to copy the current selection to the clipboard.
    let successful = document.execCommand("copy");
    if (successful) {
      // do something
    } else {
      // handle the error
    }
    if (textarea && textarea.parentNode) {
      textarea.parentNode.removeChild(textarea);
    }
  }

  add_new_worker() {
    this.selected_workers.push({
      public_key: '',
      address: ''
    })
  }
}
