import FixPageResponsive from './fixPageResponsive'
import connectToServer from './connectToServer'
import filesLoader from './filesLoader'
import ui from "./ui";

ui.fragmentToDom($('#game-region')[0]);
FixPageResponsive();
filesLoader()
    .then(connectToServer());



