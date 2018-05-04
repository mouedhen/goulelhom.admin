import {User} from "../../models/users/User";
import router from "../index"

export default function (to, from, next) {
  (new User()).isLoggedIn()
    .then(r => {
      if(r === true) {
        router.push({name: 'dashboard:index'});
        return;
      }
      next();
    })
}
