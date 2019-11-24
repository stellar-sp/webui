import { Component } from '@angular/core';
import { Server, Network, Keypair } from 'stellar-sdk';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'webui';
  server = null;
  showDeployNewSmartProgram = true;
  showWorkersList = false;
  smartAccountPublicKey = null;
  smartAccountPrivateKey = null;

  onClickSubmit(horizonAddress, networkPassphrase) {
    console.log(horizonAddress)
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
    }
  }
}
