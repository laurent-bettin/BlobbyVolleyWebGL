function Field (world, x, y, width, height) {
    // Shortcuts
    var b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
        b2BodyDef = Box2D.Dynamics.b2BodyDef,
        b2Body = Box2D.Dynamics.b2Body,
        b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
    ;

    // Properties
    this.world = world;
    this.position = { x: x, y: y };
    this.dims = [width, height];
    this.walls = [];

    // Methods
    this.init = function () {
        var ground, leftWall, rightWall, net;

        ground = this.createWall(
            x,
            y - (height / 2) - 0.5,
            width,
            0.5,
            null,
            2,
            null,
            THREE.ImageUtils.loadTexture('textures/wood.jpg'),
            'type_ground',
            20,
            0xeeeeee
        );

        leftWall = this.createWall(
            x - (width / 2) - 0.5,
            y + (height / 2),
            0.5,
            height * 2,
            null,
            0,
            null,
            null,
            null,
            20,
            0xDEDEDE,
            0
        );

        rightWall = this.createWall(
            x + (width / 2) + 0.5,
            y + (height / 2),
            0.5,
            height * 2,
            null,
            0,
            null,
            null,
            null,
            20,
            0xDEDEDE,
            0
        );

        net = this.createWall(
            x,
            y - (height / 2) + (height / 4),
            0.15,
            height / 2,
            null,
            0,
            null,
            null,
            null,
            20,
            0xDEDEDE,
            0.8
        );

        this.walls.push(ground, leftWall, rightWall, net);
    };

    this.createWall = function (x, y, width, height, density, friction, restitution, texture, userData, depth, color, opacity) {
        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_staticBody;
        bodyDef.position.x = x;
        bodyDef.position.y = y;

        var fixDef = new b2FixtureDef;
        fixDef.density = _.isNumber(density) ? density : 1;
        fixDef.friction = _.isNumber(friction) ? friction : 0.5;
        fixDef.restitution = _.isNumber(restitution) ? restitution : 0;
        fixDef.shape = new b2PolygonShape;

        if (width > height) {
            fixDef.shape.SetAsBox(width / 2, height);
        } else {
            fixDef.shape.SetAsBox(width, height / 2);
        }

        var body = this.world.CreateBody(bodyDef);

        if (typeof userData !== 'undefined') {
            body.SetUserData(userData);
        }

        body.CreateFixture(fixDef);

        var geometry = width > height
            ? new THREE.BoxGeometry(width, height * 2, _.isNumber(depth) ? depth : 0)
            : new THREE.BoxGeometry(width * 2, height, _.isNumber(depth) ? depth : 0)
        ;

        var material;

        if (texture instanceof THREE.Texture) {
            material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true
            });
        } else {
            material = new THREE.MeshBasicMaterial({
                color: !_.isUndefined(color) ? color : 0x000000,
                opacity: !_.isUndefined(opacity) ? opacity : 1,
                transparent: true
            });
        }

        var mesh = new THREE.Mesh(
            geometry,
            material
        );
        mesh.position.x = bodyDef.position.x;
        mesh.position.y = bodyDef.position.y;

        return mesh;
    };

    this.getWorld = function () {
        return this.world;
    };

    this.getPosition = function () {
        return this.position;
    };

    this.getDims = function () {
        return this.dims;
    };

    this.getWalls = function () {
        return this.walls;
    };

    this.init();
}
