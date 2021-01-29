<template>
  <div>
    
    <b-navbar toggleable="md" type="dark" variant="dark" sticky>
      <b-container fluid="lg">
        <b-navbar-brand href="#">SCP-Foundation</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item href="#">Start</b-nav-item>
            <b-nav-item href="#">Service</b-nav-item>
            <b-nav-item href="#">About</b-nav-item>
            <b-nav-item href="#">Contact</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>

    <div>
      <b-img
        src="../assets/Banner.png"
        fluid-grow
        alt="SCP-Foundation Banner"
      ></b-img>
    </div>

    <b-container class="bv-example-row">
      <b-row cols="1" cols-lg="3">
        <b-col md class="item">
          <b-row cols="2" cols-md="1">
            <b-col>
              <div>
                <b-img v-bind="mainProps" rounded="circle" alt="Circle image"></b-img>
              </div>
            </b-col>
            <b-col>
              <b-row><h2>What</h2></b-row>
              <b-row>
                <div class="text-left">
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  diam nonumy eirmod tempor invidunt ut labore et dolore magna
                  aliquyam erat, sed diam voluptua. At vero eos et accusam et
                  justo duo dolores et ea rebum. Stet clita kasd gubergren, no
                  sea takimata sanctus est Lorem ipsum dolor sit amet.
                </div>
              </b-row>
              <b-row>
                <div class="text-left more-button">
                  More
                </div>
              </b-row>
            </b-col>
          </b-row>
        </b-col>
        <b-col md class="item">
          <b-row cols="2" cols-md="1">
            <b-col>
              <div>
                <b-img v-bind="mainProps" rounded="circle" alt="Circle image"></b-img>
              </div>
            </b-col>
            <b-col>
              <b-row><h2>We</h2></b-row>
              <b-row>
                <div class="text-left">
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  diam nonumy eirmod tempor invidunt ut labore et dolore magna
                  aliquyam erat, sed diam voluptua. At vero eos et accusam et
                  justo duo dolores et ea rebum. Stet clita kasd gubergren, no
                  sea takimata sanctus est Lorem ipsum dolor sit amet.
                </div>
              </b-row>
              <b-row>
                <div class="text-left more-button">
                  More
                </div>
              </b-row>
            </b-col>
          </b-row>
        </b-col>
        <b-col md class="item">
          <b-row cols="2" cols-md="1">
            <b-col>
              <div>
                <b-img v-bind="mainProps" rounded="circle" alt="Circle image"></b-img>
              </div>
            </b-col>
            <b-col>
              <b-row><h2>Do</h2></b-row>
              <b-row>
                <div class="text-left">
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  diam nonumy eirmod tempor invidunt ut labore et dolore magna
                  aliquyam erat, sed diam voluptua. At vero eos et accusam et
                  justo duo dolores et ea rebum. Stet clita kasd gubergren, no
                  sea takimata sanctus est Lorem ipsum dolor sit amet.
                </div>
              </b-row>
              <b-row>
                <div class="text-left more-button">
                  More
                </div>
              </b-row>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>

    <div>
      <div class="fluid-container footer">
        <p class="text-center">Copyright 2021, SCP Foundation. All Rights Reserved.</p>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      mainProps: { blank: true, blankColor: '#777', width: 150, height: 150, class: 'm1' }
    }
  }
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

.more-button {
  background-color: rgb(51, 51, 51);
  color: white;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-top: 15px;
}

.item {
  padding: 15px;
}
</style>
