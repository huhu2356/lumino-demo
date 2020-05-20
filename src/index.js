const { Lumino, LocalStorageHandler, SigningHandler, } = require('@rsksmart/lumino-light-client-sdk');
const Web3 = require('web3');


const address = '0x83914c693b379175b19E234c1d2f8e09d6368656'
const chainId = 31;
const PrivateKey = '122F941AD4AAD6ECBBFB06636795CEF23CAC1A836E4A44C0106F1C3E7B2FE4BF';
const rskEndpoint = 'https://public-node.testnet.rsk.co';
const hubEndpoint = '';

const configParams = {
    chainId,
    rskEndpoint,
    hubEndpoint,
    address,
};

const web3 = new Web3(rskEndpoint);

const signingHandler = SigningHandler();
signingHandler.init(web3, PrivateKey);

await Lumino.init(signingHandler, LocalStorageHandler, configParams);

const onboarding = async () => {
    await Lumino.get().actions.onboardingClient();
};

const params = {
    Partner: '',
    settleTimeout: 500,
    tokenAddress: '',
};
await Lumino.get().actions.openChannel(params);

const setCallbacks = () => {
    // Inform that we receive a payment
    Lumino.callbacks.set.setOnReceivedPaymentCallback(payment => {
        console.log('Received a payment, now processing it...');
    });

    // A payment was completed
    Lumino.callbacks.set.setOnCompletedPaymentCallback(payment => {
        const { amount, partner: p, isReceived } = payment;
        let message = `Successfully sent ${amount} to ${p}!`;
        // We distignuish between received and sent payments with this prop
        if (isReceived) message = `Successfully received ${amount} from ${p}!`;
        console.log(message);
    });

    // A channel was opened
    Lumino.callbacks.set.setOnOpenChannelCallback(channel => {
        const { channel_identifier: id } = channel;
        const message = `Opened new channel ${id}`;
        console.log(message);
    });

    // A deposit on a channel was susccessfull
    Lumino.callbacks.set.setOnChannelDepositCallback(channel => {
        const { channel_identifier: id } = channel;
        const message = `New deposit on channel ${id}`;
        console.log(message);
    });

    // An onboarding process has started
    Lumino.callbacks.set.setOnRequestClientOnboarding(address => {
        console.log(`Requested Client onboarding with address ${address}`);
    });

    // An onboarding process was successfull
    Lumino.callbacks.set.setOnClientOnboardingSuccess(address => {
        console.log(`Client onboarding with address ${address} was successful!`);
    });
};




