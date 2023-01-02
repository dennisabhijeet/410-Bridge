const {PrivacyPolicy} = require('./privacyPolicy.model');
exports.createOrUpdatePrivacyPolicy = async(privacyPolicyData)=>{

     const isCreated = await  PrivacyPolicy.findOne();
     if(!isCreated){
       return await PrivacyPolicy.create(privacyPolicyData);
     }
    return await isCreated.update(privacyPolicyData);
}

exports.getPrivacyPolicy = async()=>{
    return await PrivacyPolicy.findOne();
}