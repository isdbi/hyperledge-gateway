import { Gateway, Wallets } from 'fabric-network';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  try {
    
    const ccpPath = path.resolve(__dirname, 'connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));


    const walletPath = path.join(__dirname, 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    
    const identity = await wallet.get('appUser');
    if (!identity) {
      console.log('❌ An identity for the user "appUser" does not exist in the wallet');
      return;
    }


    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: 'appUser',
      discovery: { enabled: true, asLocalhost: true }, 
    });


    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('alertcc'); 

    
    const lockid = '3';
    const alertType = 'FORCED_ENTRY';
    const message = 'Unauthorized entry detected at rear door';
    const reporter = 'sensor-7';

    await contract.submitTransaction('EmitAlert', lockid, alertType, message, reporter);
    console.log('✅ EmitAlert transaction has been submitted');

    
    await gateway.disconnect();

  } catch (error) {
    console.error(`❌ Failed to submit transaction: ${error}`);
    process.exit(1);
  }
}

main();