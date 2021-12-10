WebFont.load({
    google: {
        families: ["Amatic SC"]
    },
    active: e => {
        // pre-load the images
        app.loader.add("buttons","media/buttonsheet.json");
        app.loader.onComplete.add(setup);
        app.loader.load();
    }
});