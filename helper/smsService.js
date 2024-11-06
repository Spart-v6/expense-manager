import SmsAndroid from 'react-native-get-sms-android';
import moment from 'moment';
import { PermissionsAndroid, Platform } from 'react-native';

async function requestSmsPermission() {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: 'SMS Permission',
          message: 'This app requires access to your SMS messages to fetch transaction information.',
          buttonPositive: 'OK'
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return false;
}

async function fetchFilteredMessages(fromDate, toDate) {
    const hasPermission = await requestSmsPermission();
    if (!hasPermission) {
        console.log('SMS permission not granted');
        return;
    }
    const fromTimestamp = moment(fromDate, 'YYYY-MM-DD').valueOf();
    const toTimestamp = moment(toDate, 'YYYY-MM-DD').valueOf();

    const filter = {
        box: 'inbox', // Inbox messages only
        minDate: fromTimestamp,
        maxDate: toTimestamp,
    };

    
    return new Promise((resolve, reject) => {
        SmsAndroid.list(
            JSON.stringify(filter),
            (fail) => {
                console.log('Failed with this error: ' + fail);
                reject(fail);
            },
            (count, smsList) => {
                const messages = JSON.parse(smsList);
                // Map to store bank codes and their corresponding names
                const bankSuffixMap  = {
                    "ICICIT": "ICICI",
                    "DBSBNK": "DBS",
                    "SBIUPI": "SBI"
                    // more banks, check body of message first
                };

                const transactionDetails = messages
                    .filter((msg) => {
                        // msg.body.toLowerCase().includes('credited') || msg.body.toLowerCase().includes('debited')
                        const containsTransactionKeyword = /\bcredited\b|\bdebited\b/.test(msg.body);
                        const excludesRequestPhrase = !msg.body.includes("has requested money");
                        const excludesApprovalPhrase = !msg.body.includes("On approval");

                        return containsTransactionKeyword && excludesRequestPhrase && excludesApprovalPhrase;
                })
                .map((msg) => {
                    const msg_id = msg._id;
                    // Extract the bank suffix by splitting on the hyphen (-)
                    const addressParts = msg.address.split('-');
                    const bankSuffix = addressParts.length > 1 ? addressParts[1] : '';

                    const bankName = bankSuffixMap[bankSuffix] || "Unknown Bank";

                    // Detect transaction type as first small-case occurrence of "credited" or "debited"
                    const transactionTypeMatch = msg.body.match(/\b(credited|debited)\b/);
                    const transactionType = transactionTypeMatch ? transactionTypeMatch[1] : null;

                    // get amount
                    const amount = gettingAmountLogic(msg);

                    const date = moment(msg.date, 'x').format("YYYY-MM-DD");

                    if (!transactionType || amount === "0.00" || bankName === "Unknown Bank") {
                        // Skip invalid or unrecognized transactions
                        return {
                            unknown: true,
                            msgId: msg_id,
                            bank: bankName,
                            amount,
                            date,
                            transactionType: 'debited',
                        }
                    }

                    return {
                        unknown: false,
                        msgId: msg_id,
                        bank: bankName,
                        amount,
                        date,
                        transactionType,
                    };
                });
            resolve(transactionDetails);
        });
    })
}

const gettingAmountLogic = (msg) => {
    let amount = "0.00";
    const transactionMatch = msg.body.match(/(?:debited|credited)\s*(?:for|with|by)\s*(rs\.?|inr|₹)?\s?(\d+(?:,\d{3})*(?:\.\d{1,2})?)\s*on/i);
    
    if (transactionMatch) {
        // Extract the matched amount, removing commas if any
        amount = transactionMatch[2].replace(',', '');
    }

    return amount;
}

export const fetchSmses = async (from, to) => {
    return await fetchFilteredMessages(from, to);
}