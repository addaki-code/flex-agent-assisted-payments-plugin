export const GetSymbolForCurrencyISO = (isoCode) => {
    switch(isoCode){
        case "gbp": return "£";
        case "usd": return "$";
        case "eur": return "€";
        default: {
            console.log("Undefined Currency Symbol");
            return " ";
        }
    }
}