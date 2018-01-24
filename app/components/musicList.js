import React, { Component } from 'react';
import MusicListItem from './musicListItem';
import Header from './header';
import ProcessBar from './process-bar';
import { getMusicList} from "../api/rank";
import { getSingerDetail } from "../api/singer";
import { getSongList } from '../api/recommend';
import './musicList.less';

export default class MusicList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            musicList: {songlist: [], topinfo: {}},
            isHidden: true
        }
    }
    componentDidMount() {
        if (this.props.location.query.type === 'singer') {
            getSingerDetail(this.props.location.query.id).then(res => {
                console.log(res);
                this.setState({
                    musicList: res,
                    isHidden: false
                })
            });
        } else if(this.props.location.query.type === 'recommend') {
            console.log(this.props.location.query.dissid)
            getSongList(this.props.location.query.dissid).then(res => {
                console.log(res);
            })
        } else {
            getMusicList(this.props.location.query.id).then((res) => {
                console.log(res);
                this.setState({
                    musicList: res,
                    isHidden: false
                })
            });
        }

    }
    componentWillUnmount() {

    }
    render() {
        let item = this.state.musicList;
        return(
            <div>
                <Header title={item.topinfo.ListName} left={'left'}/>
                {
                    this.props.currentMusicItem.type === 'nomusic'
                        ? '' : <ProcessBar currentMusicItem={this.props.currentMusicItem} isPlay={this.props.isPlay}/>
                }
                <div id="content">
                    <div className={`${!this.state.isHidden ? 'hidden' : 'show'} loading`}>加载中...</div>
                    <div className={`${this.state.isHidden ? 'hidden' : 'show'} music-list`}>
                        <div className='top-info' >
                            <img src={item.topinfo.pic_album} alt=""/>
                            <div className='info'>
                                <p className='title'>{item.topinfo.ListName}</p>
                                <p>第{item.day_of_year || 1}天</p>
                                <p>更新时间：{item.update_time}</p>
                            </div>
                            <i className="mark filter" style={{backgroundImage:`url(${item.topinfo.pic_album})`}}/>
                        </div>
                        <ul style={{padding:'0 .75rem',background:'#fafafa'}}>
                            {item.songlist.map((v) => {
                                let isFocus = v.id === this.props.currentMusicItem.id;
                                let musicData = {
                                    songname: v.data.songname,
                                    singername: v.data.singer.map(item => item.name).join('/'),
                                    albumname: v.data.albumname,
                                    songid: v.data.songid,
                                    interval: v.data.interval,
                                    albummid: v.data.albummid,
                                    songmid: v.data.songmid,
                                }
                                return(
                                    <MusicListItem
                                        key={v.data.songid}
                                        musicListItem={musicData}
                                        focus={isFocus}
                                    />
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}