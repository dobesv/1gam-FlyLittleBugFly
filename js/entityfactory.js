EntityFactory = pc.EntityFactory.extend('EntityFactory',
    { },
    {
        init:function ()
        {
        },
        createEntity:function (layer, type, x, y, dir, shape, options)
        {
            console.log('Create entity', type, x, y, dir);
        }
    }
);
