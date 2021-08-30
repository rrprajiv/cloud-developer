import { Router, Request, Response } from 'express';
import { FeedItem } from '../models/FeedItem';
import { requireAuth } from '../../users/routes/auth.router';
import * as AWS from '../../../../aws';

const router: Router = Router();

// Get all feed items
router.get('/', async (req: Request, res: Response) => {
    const items = await FeedItem.findAndCountAll({order: [['id', 'DESC']]});
    items.rows.map((item) => {
            if(item.url) {
                item.url = AWS.getGetSignedUrl(item.url);
            }
    });
    res.send(items);
});

//@TODO
//Add an endpoint to GET a specific resource by Primary Key
router.get('/:id', async (req: Request, res: Response) => {
    const id    = req.params.id;
    const item = await FeedItem.findByPk(id);
    if (item == null)
        res.status(400).send({message: 'Item not Found'});
    if(item.url) {
        item.url = AWS.getGetSignedUrl(item.url);
    }
    res.send(item);
});

// update a specific resource
router.patch('/:id', 
    requireAuth, 
    async (req: Request, res: Response) => {
        //@TODO try it yourself
        const feedId = req.params.id;
        console.log('feedId : ' + feedId);
        if (feedId == null) 
            res.status(400).send({message: 'Item not Found'});
        const feedItem = await FeedItem.findByPk(feedId);
        console.log('Returned Value : ' + feedItem);
        if (feedItem == null)
            res.status(400).send('No feed with the given id');
        const caption = req.body.caption;
        // line below is dummy data
        const fileName = 'https://udagram-ruttner-dev.s3.us-east-2.amazonaws.com/test.jpg';
        const item = await feedItem.update({caption: caption, url: fileName});
        console.log('After update call : ' + item);
        const saved_item = await item.save();
        console.log('After save call : ' + saved_item);
        res.send(200).send('Record updated successfully');

        // res.send(500).send("not implemented")
});


// Get a signed url to put a new item in the bucket
router.get('/signed-url/:fileName', 
    requireAuth, 
    async (req: Request, res: Response) => {
    let { fileName } = req.params;
    console.log(`fileName : ${fileName}`);
    const url = AWS.getPutSignedUrl(fileName);
    res.status(201).send({url: url});
});

// Post meta data and the filename after a file is uploaded 
// NOTE the file name is they key name in the s3 bucket.
// body : {caption: string, fileName: string};
router.post('/', 
    requireAuth, 
    async (req: Request, res: Response) => {
    const caption = req.body.caption;
    const fileName = req.body.url;

    // check Caption is valid
    if (!caption) {
        return res.status(400).send({ message: 'Caption is required or malformed' });
    }

    // check Filename is valid
    if (!fileName) {
        return res.status(400).send({ message: 'File url is required' });
    }

    const item = await new FeedItem({
            caption: caption,
            url: fileName
    });

    const saved_item = await item.save();

    saved_item.url = AWS.getGetSignedUrl(saved_item.url);
    res.status(201).send(saved_item);
});

export const FeedRouter: Router = router;