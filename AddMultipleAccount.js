import { LightningElement,track,api,wire} from 'lwc';
import saveAccounts from '@salesforce/apex/AccountInfo.createAccounts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import INDUSTRY_FIELD from "@salesforce/schema/Account.Industry";

export default class AddMultipleAccount extends LightningElement {
    @track keyIndex = 1;  
    @track error;
    @track message;
    @track accountRecList = [
        {                      
            Name: '',
            Industry: '',
            Phone: ''
        }
    ];
    picklistValues = []
   @wire(getPicklistValues, {
    recordTypeId: '012000000000000AAA',
    fieldApiName: INDUSTRY_FIELD,
  })
  getPicklistValuesForField({ data, error }) {
    if (error) {
      // TODO: Error handling
      console.error(error)
    } else if (data) {
      this.picklistValues = [...data.values]
    }
  }
    //Add Row 
    addRow() {
        this.keyIndex+1;   
        this.accountRecList.push ({            
            Name: '',
            Industry: '',
            Phone: ''
        });
        console.log('Enter ',this.accountRecList);
        console.log('Enter ',this.accountRecList);
    }
    changeHandler(event){       
       // alert(event.target.id.split('-'));
        console.log('Access key2:'+event.target.accessKey);
        console.log('id:'+event.target.id);
        console.log('value:'+event.target.value);       
        if(event.target.name==='accName')
            this.accountRecList[event.target.accessKey].Name = event.target.value;
        else if(event.target.name==='accIndustry'){
            this.accountRecList[event.target.accessKey].Industry = event.target.value;
        }
        else if(event.target.name==='accPhone'){
            this.accountRecList[event.target.accessKey].Phone = event.target.value;
        }
    }
    //Save Accounts
     saveMultipleAccounts() {

        console.log("accountlist"+JSON.stringify(this.accountRecList));
        saveAccounts({ accountList : this.accountRecList })
            .then(result => {
                this.message = result;
                this.error = undefined;                
                this.accountRecList.forEach(function(item){                   
                    item.Name='';
                    item.Industry='';
                    item.Phone='';                   
                });

                //this.accountRecList = [];
                if(this.message !== undefined) {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Accounts Created!',
                            variant: 'success',
                        }),
                    );
                }
                
                console.log(JSON.stringify(result));
                console.log("result", this.message);
            })
            .catch(error => {
                this.message = undefined;
                this.error = error;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating records',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
                console.log("error", JSON.stringify(this.error));
            });
    }
    removeRow(event){       
        console.log('Access key2:'+event.target.accessKey);
        console.log(event.target.id.split('-')[0]);
        if(this.accountRecList.length>=1){             
             this.accountRecList.splice(event.target.accessKey,1);
             this.keyIndex-1;
        }
    }  

}
