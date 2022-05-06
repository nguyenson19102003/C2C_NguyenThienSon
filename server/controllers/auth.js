const bcrypt = require('bcrypt');
const Auth = require('../models/auth')

exports.postRegister = async(req, res) => {
    const {userAddress, email, password} = req.body
    try{
        //
        const addressExist = await Auth.find({userAddress: userAddress});
        console.log(addressExist)

        if(addressExist.length) {
            console.log("ADDRESS exist");
            return res.status(400).json({
                success: false,
                message: 'address Exist!',
                address: true
            });
        }
        
        const emailExist = await Auth.find({email: email});
        
        if(emailExist.length){
            console.log("Email exist");
            return res.status(400).json({
                success: false,
                message: 'Email Exist!',
                email: true,
            });
        }
        
        

        if(!validateEmail(email)){
            console.log("email không hợp lệ");
            return res.status(400).json({
                success: false,
                message: 'email không hợp lệ!',
            });
        }
        
        //Hash passwords
        const salt  = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const auth = new Auth({
            userAddress: userAddress,
            email: email,
            password: hashedPassword,
        });

        const saveAuth = await auth.save();

        res.status(200).json({success: true, message: 'Đăng Ký Thành Công' });
        console.log("Đăng Ký Thành Công");

    }
    catch(err){
        console.log(err)
        res.json(err);
    }
}

exports.postLogin = async (req, res) => {
    const {userAddress,  password} = req.body
    const auth = await Auth.find({userAddress: userAddress});

    // console.log(auth[0].password, password)

    if(!auth.length) {
        console.log("Khong Ton tai");

        return res.status(400).json({
            success: false,
            message: 'userAddress or password is wrong',
        });
    }

    const validPass = await bcrypt.compare(password, auth[0].password);
    // console.log(validPass);

    if (!validPass) {
        console.log("Sai Mật Khẩu")
        return res.status(400).json({
            success: false,
            message: 'Địa chỉ hoặc mật khẩu sai',
        })
    }
    
    res.cookie('userAddress', userAddress);

    console.log("Đăng Nhập Thành Công");
    return res.status(200).json({
        success: true,
        admin: auth[0].role,
        userAddress: userAddress,
        message: 'Đăng Nhập Thành Công',
    });

}


exports.logout = async (req, res) =>{
    try {
        res.clearCookie('userAddress');
        return res.status(200).json({
            success: true,
            message: 'Đã Đăng Xuất',
        });
    } catch (error) {
        return res.status(500).json({ message: "logout failed!" });
    }
}

exports.getUsers = async (req, res) =>{
    try {
        console.log("User")
        const users = await Auth.find();
        return res.json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.updateStateUser = async (req, res) =>{
    const addressUser = req.params.addressUser;
    const state = req.body.state;

    const user = await Auth.findOne({userAddress: addressUser});

    if(user[0]){
        return res.json({ type: 400, message:"Not found User"})
    }
   try {

    await Auth.findOneAndUpdate(
        { userAddress: addressUser },
        {
            state: state,
        },
    );

    console.log("Update state user Success")

    return res.status(200).json({ success: true, message: "update user Success"});

    } catch (err) {
        console.log("Update state user failed")
        console.log(err);
        res.status(500).json({ message: res.message });
    }
}

const validateEmail = (email) => {
    const re =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(email);
};