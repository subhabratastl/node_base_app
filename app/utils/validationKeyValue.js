var validationKeyValue = module.exports = {
    keyAndValueValidate: (requiredFields,params)=>{
        const areAllFieldsPresent = requiredFields.every(field => params.hasOwnProperty(field));
        if(areAllFieldsPresent){
            return Object.keys(params).every(key => {
                const value = params[key];
                return value !== null && value !== undefined && value !== '';
              });
        }else{
            return false;
        }
    }
}