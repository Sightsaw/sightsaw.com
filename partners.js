
function getPartnership(partner) {
    var defaultPartner = "sightsaw";


    var partnerShips = {

        sightsaw: {
                    windowTitle: "Sightsaw Education",
                    pageTitle: "Sightsaw Education",
                    logoImage: "",
                    logoHeight: "30",
                    logoWidth: "30",
                    contactInfo: ["Email: <a href=\"mailto:sightsaw.llc@gmail.com\">sightsaw.llc@gmail.com</a>"
                                 ],
                    tabs: [
                            "pivot-home",
                            "pivot-number-munchers-1st",
                            "pivot-number-munchers-3rd",
                            "pivot-word-munchers",
                            "pivot-word-munchers-pos",
                            "pivot-spanish-munchers-verbs",
                            "pivot-spanish-munchers-nouns",
                            "pivot-acorns",
                            "pivot-lettermind",
                            "pivot-shibacatch"
                          ]
                            
               }
    };



    var partnerConfig = partnerShips[defaultPartner];

    var overrides = partnerShips[partner];
    if (!(typeof overrides === "undefined")) {
        for (var key in overrides) {
            partnerConfig[key] = overrides[key];
        }
    }

    return partnerConfig;
}
