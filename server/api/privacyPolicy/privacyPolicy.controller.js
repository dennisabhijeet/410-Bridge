const privacyPolicyHelper = require('./privacyPolicy.helper');
exports.get = async(req,res,next) => {
    if(!(req.policy && req.policy.createPartner)){
        next(new Error('Unauthorized'))
        return
    } 
    const privacyPolicy = await privacyPolicyHelper.getPrivacyPolicy();
    res.send( privacyPolicy);
}

exports.put = async(req,res,next)=>{
    if(!(req.policy && req.policy.createPartner)){
        next(new Error('Unauthorized'))
        return
    }
    const privacyPolicyData = req.body;
    const privacyPolicy = await privacyPolicyHelper.createOrUpdatePrivacyPolicy(privacyPolicyData);
    res.send(privacyPolicy);
}