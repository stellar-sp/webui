import { Component } from '@angular/core';
import { Server, Network, Keypair, TransactionBuilder, Operation } from 'stellar-sdk';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

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
  networkPassphrase = 'Test SDF Network ; September 2015';
  showDeployNewSmartProgram = true;
  showWorkersList = false;
  smartAccountPublicKey = null;
  smartAccountPrivateKey = null;
  smartAccountCreatorSeed = null;
  smartAccountCreator = null;
  emptyFileOnIpfsHash = "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH";

  imageAddress = '';
  imageHash = '';
  executionFee = '1000';

  newWorkerPublicKey = '';
  newWorkerAddress = '';
  newWorkerHorizon = 'https://horizon-testnet.stellar.org';
  newWorkerNetworkPassphrase = 'Test SDF Network ; September 2015';
  newWorkerIpfsAddress = '';

  workers = [];
  result_message = "";
  selected_workers = [
    {
      public_key: '',
      address: ''
    }
  ];

  addNewWorkerResultMessage = "";

  subscription: Subscription;

  ngOnInit() {
    const source = interval(10000);
    this.subscription = source.subscribe(val => this.getWorkersList());
  }

  constructor(private http: HttpClient) { }

  onSubmit() {
    var self = this;
    (async function main() {

      try {

        self.result_message = new Date().toLocaleString() + " INFO: creating smart account..."

        var smartAccountCreatorKeyPair = Keypair.fromSecret(self.smartAccountCreatorSeed)

        self.server = new Server(self.horizonAddress)

        self.smartAccountCreator = await self.server.loadAccount(smartAccountCreatorKeyPair.publicKey());

        var lastestLedgerPromise = await self.http.get(self.horizonAddress + "/ledgers?order=desc&limit=1").toPromise()
        var baseReserve = (lastestLedgerPromise._embedded.records[0].base_reserve_in_stroops / 10000000) * 2 + 10;

        const fee = await self.server.fetchBaseFee()
        const createSmartAccountTransaction = new TransactionBuilder(self.smartAccountCreator, { fee : fee, networkPassphrase : self.networkPassphrase })
          .addOperation(
            Operation.createAccount({
              destination: self.smartAccountPublicKey,
              startingBalance: baseReserve +""
            })
          )
          .setTimeout(0)
          .build();

        createSmartAccountTransaction.sign(smartAccountCreatorKeyPair)
        const createSmartAccountResult = await self.server.submitTransaction(createSmartAccountTransaction)

        self.result_message += " done \n"

        self.result_message += new Date().toLocaleString() + " INFO: setting smart program image specifications... "
        var smartProgramSpecOps = [
          Operation.manageData({ name: 'current_state', value: 'QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH' }), // an empty file hash
          Operation.manageData({ name: 'smart_program_image_address', value: self.imageAddress }),
          Operation.manageData({ name: 'smart_program_image_hash', value: self.imageHash }),
          Operation.manageData({ name: 'execution_fee', value: self.executionFee }),
          Operation.manageData({ name: 'latest_transaction_changed_state', value: createSmartAccountResult.hash }),
        ]

        for (let i =0; i< self.selected_workers.length; i++) {
          smartProgramSpecOps.push(Operation.manageData({ name: 'worker_'+ (i+1) +'_address', value: self.selected_workers[i].address }))
          smartProgramSpecOps.push(Operation.manageData({ name: 'worker_'+ (i+1) +'_public_key', value: self.selected_workers[i].public_key }))
          smartProgramSpecOps.push(Operation.setOptions({ signer : {
              ed25519PublicKey: self.selected_workers[i].public_key,
              weight: 1
            }
          }))
        }

        const percent51 = parseInt(self.selected_workers.length / 2) + 1
        smartProgramSpecOps.push(Operation.setOptions({ masterWeight : 0, lowThreshold: percent51, medThreshold: percent51, highThreshold: percent51 }))

        await self.signAndSubmit(self, smartProgramSpecOps)
        self.result_message += "done \n"

        self.result_message += "conguradulation. you created the smart account successfully";
      }
      catch(error) {
        console.error(error);
        self.result_message = error.message;
      }

    })()
  }

  async signAndSubmit(self, ops) {

    const smartAccount = await self.server.loadAccount(accountPublicKey)

    const fee = await self.server.fetchBaseFee();

    var txBuilder = new TransactionBuilder(smartAccount, { fee : fee, networkPassphrase : self.networkPassphrase })
      .setTimeout(0);

    for (let op of ops) {
      txBuilder.addOperation(op)
    }

    var tx = txBuilder.build()

    var smartAccountKeyPair = Keypair.fromSecret(self.smartAccountPrivateKey)

    tx.sign(smartAccountKeyPair)

    const xdr = tx.toEnvelope().toXDR().toString("base64")
    console.log(xdr);

    var submitTxResult = await self.server.submitTransaction(tx);
    console.log(submitTxResult)
  }

  generateNewKeyPair() {
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

  addEmptyWorkerToSelectedList() {
    this.selected_workers.push({
      public_key: '',
      address: ''
    })
  }

  addNewWorker() {
    var self = this;

    this.addNewWorkerResultMessage = "adding wokrer...";

    const newWorkerSpec = {
      public_key : this.newWorkerPublicKey,
      address: this.newWorkerAddress,
      horizon_address: this.newWorkerHorizon,
      network_passphrase: this.newWorkerNetworkPassphrase,
      ipfs_address: this.newWorkerIpfsAddress
    }

    this.http.post('http://localhost:3000/api/workers', newWorkerSpec).subscribe(
      (val) => { },
      (response) => {
        self.addNewWorkerResultMessage += " done! ";
        self.getWorkersList();
      }
    )
  }
}
