import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { battle } from '../utils/api';
import { Link } from 'react-router-dom';
import PlayerPreview from './PlayerPreview';
import Loading from './Loading';


function Profile({info}){
 
	return(
		//all this is the block of text after the battle. Its saying: show their name IF info.name is thing. Same thing with info.location and info.company. Show their followers and following and if they have a blog show that too
			<PlayerPreview avatar ={info.avatar_url} username ={info.login}>
				<ul className ='space-list-items'>
					{info.className	&&	<li>{info.name}</li>}
					{info.location	&&	<li>{info.location}</li>}
					{info.company	&&	<li>{info.company}</li>}
					<li>Followers: {info.followers}</li> 
					<li>Following: {info.following}</li>
					<li>Public Repos: {info.public_repos}</li>
					{info.blog && <li><a href={info.blog}>{info.blog}</a></li>}
				</ul>
			</PlayerPreview>
	)
}


function Player({label,score,profile}){
	return(
		<div>
			<h1 className ='header'> {label} </h1>
			<h3 style ={{textAlign: 'center'}}>Score:  {score}</h3>
			<Profile info ={profile} />
		</div>
		)
}

Player.propTypes = {
	label: PropTypes.string.isRequired,
	score: PropTypes.number.isRequired,
	profile: PropTypes.object.isRequired

}


class Results extends React.Component{
	state = {
		winner:null,
		loser:null,
		error:null,
		loading: true
	}

	async componentDidMount(){
		 const {playerOneName,playerTwoName} = queryString.parse(this.props.location.search);//destructure the result of calling .parse

		 const players = await battle([	
			playerOneName,  
			playerTwoName
			])

		
	 
			if(results === null){
				return this.setState(() => ({
		
						error: 'Looks like theres an error. Check that both users exist on Github',
						loading: false,

				}))
			}
			//if there is no error, we got a correct response from the github API then:
			this.setState(() =>({
					error: null,
					winner: results[0],
					loser: results[1],
					loading: false

			})); // the "this" in this.setState is the SAME as the "this" on bind(this)
 
	}

	render(){
		const {error, winner , loser, loading } = this.state;

		if(loading === true){
			return <Loading />
		}
		if(error){
			return(
				<div>
					<p>{error} </p>
					<Link to='/battle/'> Reset </Link>
				</div>
				)
		}

		return(
				<div className= 'row'> 
					<Player  
						label = 'Winner'
						score = {winner.score}
						profile = {winner.profile}
					/>

					<Player  
						label = 'Loser'
						score = {loser.score}
						profile = {loser.profile}
					/>
				</div>
		)
	}
}

export default Results;