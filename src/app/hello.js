export default class Greetings extends Component{

    constructor(props){
        super(props)
        this.state = {
            x : 1
        }
    }

    render(){
        return <div style={{background:'blue', width:'500px'}}>
            <h1 onClick={()=>{
                this.setState({x:this.state.x+1})
            }}>
            {'Greetings, ' + this.props.name + '!!!'}
                <input />
                {this.state.x}
            </h1>
            </div>
    }
}