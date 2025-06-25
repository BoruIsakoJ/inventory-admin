import Chart from "../../components/chart/Chart"
import FeaturedInfo from "../../components/featuredinfo/FeaturedInfo"
import "./home.css"

function Home() {
  return (
    <div className="home">
      <FeaturedInfo/>
      <Chart/>
      <div className="homeWidgets">

      </div>
    </div>
  )
}

export default Home