import express, { Router } from 'express';
import { wrapRes, wrapResError } from '../utils';
const router:Router = express.Router()
router.get('/order', (req, res) => {
  const json = wrapRes({
    orderId: '11111',
    productId:'2222',
    userId: '3333',
    amount: 100
  })
  res.json(json)
})

router.get('/user', (req, res) => {
  let json
  if(req.query.userId !== '3333') {
    json = wrapResError({}, -1, '不存在此用户')
  } else {
    json = wrapRes({
      userId: '3333',
      userName: '张峰'
    })
  }
  res.json(json)
})

router.get('/product', (req, res) => {
  const json = wrapRes({
    productId: '2222',
    productName: '苹果电脑'
  })
  res.json(json)
})

export default router