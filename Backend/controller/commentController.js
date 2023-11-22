const Joi = require('joi')
const Comment = require('../models/comment');
const CommentDTO = require('../dto/comment');


const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;


const commentController = {
    async create(req, res, next){
        console.log('Here');

        const createCommentSchema = Joi.object({
            content: Joi.string().required(),
            author: Joi.string().regex(mongodbIdPattern).required(),
            blog: Joi.string().regex(mongodbIdPattern).required()
        });

        const {error} = createCommentSchema.validate(req.body);

        if (error){
            return next(error)
        }

        const {content, author, blog} = req.body;

        try {
            const newComment = new Comment({
                content,
                author,
                blog
            });

            await newComment.save();
        } catch (error) {
            return next(error);
        }

        return res.status(201).json({message: 'Comment Posted Sucessfully'});
    },
    async getById(req, res, next){
        const getByIdSchema = Joi.object({
            id: Joi.string().regex(mongodbIdPattern).required()
        });

        const {error} = getByIdSchema.validate(req.params);

        const {id} = req.params;
        if(error){return next (error);}

        let comments
        try {
            comments = await Comment.find({blog:id}).populate('author');
        } catch (error) {
            return next(error);
        }

        let commentDto = [];
        for(i=0; i<comments.length; i++){

            const obj = new CommentDTO(comments[i]);
            commentDto.push(obj);

        }

        return res.status(200).json({data:commentDto});
    }
    
}


module.exports = commentController;