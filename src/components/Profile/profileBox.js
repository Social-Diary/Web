import { Box, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import authService from '../../services/auth_api';
import UserImage from '../Common/userImage';
import { useRecoilValue } from 'recoil';
import { userState } from '../../atom/auth';
import followService from '../../services/follow_api';

export default function ProfileBox(props) {
    const rootUser = useRecoilValue(userState);
    const [isFollowing, setIsFollowing] = useState(false);
    const [user, setUser] = useState(null);
    const handleFollow = () => {
        if (isFollowing) {
            followService.unfollow(props.userId).then((res) => {
                if (res) {
                    setIsFollowing(false);
                } else {
                    alert('언팔로우에 실패했습니다.');
                }
            });
        } else {
            followService.follow(props.userId).then((res) => {
                if (res) {
                    setIsFollowing(true);
                } else {
                    alert('팔로우에 실패했습니다.');
                }
            });
        }
    };
    useEffect(() => {
        if (props.userId && rootUser.id) {
            console.log('props.userId', props.userId);
            console.log('rootUser.id', rootUser.id);
            authService.getUserInfoById(props.userId).then((res) => {
                if (res) {
                    console.log(res);
                    setUser(res);
                } else {
                    alert('유저 정보를 불러오는데 실패했습니다.');
                }
            });
            if (rootUser.id != props.userId) {
                followService.getFollowing(rootUser.id).then((res) => {
                    if (res) {
                        res.data.some((e) => e.followingMemberId == props.userId) &&
                            setIsFollowing(true);
                    } else {
                        alert('팔로잉 정보를 불러오는데 실패했습니다.');
                    }
                });
            }
        }
    }, [props.userId, rootUser.id]);
    return (
        user && (
            <>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        textAlign: 'center',
                    }}>
                    <UserImage userId={props.userId} width={80} profileImage={user.picture} />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 'bold', textAlign: 'left', paddingLeft: 4 }}>
                            {user.nickname}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', paddingTop: 1 }}>
                            <Box sx={{ width: 100 }}>{user.followerCount + '명'}</Box>
                            <Box sx={{ width: 100 }}>{user.followingCount + '명'}</Box>
                        </Box>
                        {rootUser.id != props.userId && (
                            <Box sx={{ width: '100%', textAlign: 'center', marginTop: 1 }}>
                                <Button
                                    sx={{
                                        margin: 'auto',
                                        backgroundColor: isFollowing ? 'grey' : '#a8d59e99',
                                        paddingY: 0.2,
                                    }}
                                    onClick={handleFollow}
                                    variant="contained">
                                    {isFollowing ? '언팔로잉' : '팔로잉'}
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Box>

                {user.introduce && <Typography sx={{ paddingY: 3 }}>{user.introduce}</Typography>}
            </>
        )
    );
}
