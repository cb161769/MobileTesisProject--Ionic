/**
 * this is the class of the Fare Model
 */
export class FareModels {
    fareConfigurationId:string;
    fareId: string;
    fixedFee1:{
        FixedFeeId:any;
        ConsumptionDescription:any;
        fixedFeeCondition: any;
        fixedFeeCalculated:any;
        fixedFeeApplied:any;
    };
    fixedFee2:{
        FixedFeeId:any;
        ConsumptionDescription:any;
        fixedFeeCondition: any;
        fixedFeeCalculated:any;
        fixedFeeApplied:any;
    };
    energyConditions:{
        conditions:{
            energyCondition1:{
                minimumKilowatt:any;
                maximumKilowatt:any;
                fixedFeeCalculated:any;
                fixedFeeApplied:any;
            },
            energyCondition2:{
                minimumKilowatt:any;
                maximumKilowatt:any;
                fixedFeeCalculated:any;
                fixedFeeApplied:any;
            },
            energyCondition3:{
                minimumKilowatt:any;
                maximumKilowatt:any;
                fixedFeeCalculated:any;
                fixedFeeApplied:any;
            },
            energyCondition4:{
                minimumKilowatt:any;
                maximumKilowatt:any;
                fixedFeeCalculated:any;
                fixedFeeApplied:any;
            }
        }
    };

}
