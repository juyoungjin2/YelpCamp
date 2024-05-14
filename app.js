const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override')
mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DATABASE CONNECTED!!!!!!!!!!!')
});

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
// 바디를 parsing하기 위해
app.use(express.urlencoded({ extended: true }))
// 메서드오버라이드 사용 (put, patch, del)
app.use(methodOverride('_method'))
//시작페이지
app.get('/', (req, res) => {
    res.render('home')
})

//인덱스 페이지
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('./campgrounds/index', { campgrounds })
})

app.post('/campgrounds', async (req, res) => {
    const newCampground = new Campground(req.body.campground)
    await newCampground.save()
    res.redirect(`/campgrounds/${newCampground._id}`)
})

//새로운 캠프그라운드 생성하기
app.get('/campgrounds/new', (req, res) => {
    res.render('./campgrounds/new')
})
//상세 페이지
app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('./campgrounds/show', { campground })
})
//캠프그라운드 수정하기
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('./campgrounds/edit', { campground })
})
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${campground._id}`)
})
app.delete('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect(`/campgrounds`)
})


app.listen(3000, () => {
    console.log('Serving on port 3000')
})