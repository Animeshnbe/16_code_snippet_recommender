const Code = require('../models/Code')
const express = require('express')
const router = express.Router()
const path = require('path')


const isAlive = (req, res, next) => {
    if(req.session.user){
        next()
        return
    }
    return res.status(401).send("Unauthorized...");
}


// router.use(isAlive)
function pagelist(items) {
    result = "<html><body><ul>";
    items.forEach(function(item) {
      itemstring = "<li>" + item._id + "<ul><li>" + item.textScore +
        "</li><li>" + item.created + "</li><li>" + item.document +
        "</li></ul></li>";
      result = result + itemstring;
    });
    result = result + "</ul></body></html>";
    return result;
  }

router.get('/', async (req, res) => {
    try {
        search = req.query.search
        let queries
        // const newCode = new Code({name:"test.py",lang:"python",contents:"print(\"Hello World\")",meta:m,size:1});
        // await newCode.save();
        queries = await Code.find({ meta: { "$regex": search, "$options": "i" }, is_correct:true }).sort({rating:-1,updatedAt:-1});


        if(!queries.length){
            return res.status(204).json({ data: "No queries exist..." })
        }
          
        queries.toArray(function(err, items) {
            res.send(pagelist(items));
        });
        // res.sendFile(path.join(__dirname+'/index.html'));
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
    const newCode = new Code({ name, lang, contents, meta, size, author, is_correct: true, rating: -1, count: 0  });
    const saved = await newCode.save();

    if (saved) {
        return res.status(200).json({ data: newCode })
        // res.render('success', {roll:savedStd._id});
    }
    else {
        return res.status(500).json({ data: "Couldn't save query details" })
    }
})


router.put('/:id', async (req, res) => {
    let { rating, is_correct } = req.body;

    const existStd = await Code.findOne({ _id:req.params.id });
    if (!existStd) {
        return res.status(500).json({ msg: "Code snippet doesn't exist..." });
    }

    let count = existStd.count;
    let new_rating = rating
    if (existStd.rating!=-1)
        new_rating = (existStd.rating*count+rating)/count+1;

    count++
    const std = await Code.findByIdAndUpdate(existStd.id, { new_rating, is_correct, count })

    if (std) {
        return res.status(200).json({ data: "Updated successfully" })
    }
    else {
        return res.status(500).json({ msg: "Couldn't update code review" })
    }
})


module.exports = router