const privacyPolicyHelper = require('./privacyPolicy.helper');
exports.get = async(req,res,next) => {
    if(!(req.policy && req.policy.createPartner)){
        next(new Error('Unauthorized'))
        return
    } 
    const privacyPolicy = await privacyPolicyHelper.getPrivacyPolicy();
    res.json( privacyPolicy);
}

exports.put = async(req,res,next)=>{
    if(!(req.policy && req.policy.createPartner)){
        next(new Error('Unauthorized'))
        return
    }
    const privacyPolicyData = req.body;
    const privacyPolicy = await privacyPolicyHelper.createOrUpdatePrivacyPolicy(privacyPolicyData);
    res.json(privacyPolicy);
}

exports.getPage = async(req,res,next)=>{
    const privacyPolicyData = await privacyPolicyHelper.getPrivacyPolicy();
    const {body} = privacyPolicyData;
    res.send(body)
}