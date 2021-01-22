<template>
  <div class="container">
    <form class="sign-in" @submit.prevent="onSubmit">
      <h2> Sign In </h2>
      <div>Use your account</div>
      <input class="input_sign" id="username" type="text" placeholder="Username" v-model="credentials.email"/>
      <input class="input_sign" id="password" type="password"  placeholder="Password" v-model="credentials.password"/>
      <input class="button_sign" type="submit" value="Login" name="login" id="login" />
    </form>
  </div>
</template>

<script>
import Index from "../../pages/index.vue";
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: "LoginFormComponent",
  data(){
    return{
      credentials: {
        email: '',
        password: ''
      }
    };

  },
  components: {
    Index,
  },
  methods: {
    ...mapActions('auth', ['login']),
    async onSubmit() {
      console.log("apollo", this.$apollo)
      this.login({...this.credentials, apollo: this.$apollo})

      //console.log(res)
    },
  }
};
</script>

<style>
.container{
  position: relative;
  left: 30%;
  width: 500px;
  height: 400px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, .2),
              0 15px 30px rgba(0, 0, 0, .2);
  background: linear-gradient(to bottom , #efefef, #ccc);

}
h2{
  margin: 0;
}
.sign-in{
  position: absolute;
  left: 25%;
  top: 20%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  padding: 20% 10%;
  width: calc(70% - 10%);
  height: calc(70% - 20%);
  text-align: center;
  background: linear-gradient(to bottom , #efefef , #ccc);
  transition: all .5s ease-in-out;
}

.input_sign {
  background-color: #eee;
  border: none;
  padding: 8px 15px;
  margin: 6px 0;
  width: calc(150% - 10%);
  border-radius: 15px;
  box-shadow: inset 0 1px 2px rgb(0, 0, 0 , .4),
                    0 -1px 1px #fff,
                    0 1px 0 #fff;
  overflow: hidden;

  
  }
.button_sign{
  border-radius: 20px;
  border: 1px solid #009345;
  background-color:#009345 ;
  color: #fff;
  font-size: 1rem;
  
  padding: 10px 40px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform .1s ease-in;      
}

</style>
