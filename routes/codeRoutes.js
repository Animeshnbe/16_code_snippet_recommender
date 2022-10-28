const Code = require('../models/Code')
const express = require('express')
const router = express.Router()

const isAlive = (req, res, next) => {
    if(req.session.user){
        next()
        return
    }
    return res.status(401).send("Unauthorized...");
}


// router.use(isAlive)

router.get('/', async (req, res) => {
    try {
        search = req.query.search
        let queries
        // const newCode = new Code({name:"test.py",lang:"python",contents:"print(\"Hello World\")",meta:m,size:1});
        // await newCode.save();
        queries = await Code.find({ meta: { "$regex": search, "$options": "i" } }).sort({updatedAt:-1});

        if(!queries.length){
            return res.status(204).json({ data: "No queries exist..." })
        }

        return res.status(200).json({ data: queries })
    } catch (err) {
        console.log(err)
        return res.status(500).send("Something went wrong!")
    }
})


router.post('/', async (req, res) => {
    console.log(req.body)
    let { name, lang, contents, m, size, author } = req.body;

    let meta = m.split(",")
    if (!name || !lang || !contents || !size) {
        return res.status(400).send("Required fields missing");
    }

    // let std_roll = req.session.user.rollno
    const newCode = new Code({ name, lang, contents, meta, size, author });
    const saved = await newCode.save();

    if (saved) {
        return res.status(200).json({ data: newCode })
        // res.render('success', {roll:savedStd._id});
    }
    else {
        return res.status(500).json({ data: "Couldn't save query details" })
    }
})


// router.put('/:id', async (req, res) => {
//     const { ta_comment } = req.body;

//     console.log(ta_comment)
//     const existStd = await Query.findOne({ _id:req.params.id });
//     if (!existStd) {
//         return res.status(500).json({ msg: "Query doesn't exist..." });
//     }

//     const std = await Query.findByIdAndUpdate(existStd.id, { ta_comment, IsActive: false })

//     if (std) {
//         return res.status(200).json({ data: "Posted successfully" })
//     }
//     else {
//         return res.status(500).json({ msg: "Couldn't update query" })
//     }
// })


module.exports = router