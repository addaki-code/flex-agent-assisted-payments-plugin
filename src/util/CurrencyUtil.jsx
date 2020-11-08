import config from "../payConfig.json"

export const GetSymbolForCurrencyISO = (isoCode) => {
    
    const match = config.CURRENCY_CONFIG.filter(currency => currency.ISO === isoCode);
    
    if(match.length != 1){
        console.log("Invalid Currency Config for: " + isoCode);
        return " ";
    }else{
        return match[0].Symbol;
    }    

}