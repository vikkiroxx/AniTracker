export const UPDATE_ANIME_PROGRESS = `
  mutation ($id: Int, $mediaId: Int, $progress: Int, $status: MediaListStatus, $scoreRaw: Int, $repeat: Int) {
    SaveMediaListEntry(id: $id, mediaId: $mediaId, progress: $progress, status: $status, scoreRaw: $scoreRaw, repeat: $repeat) {
      id
      progress
      status
      score(format: POINT_10_DECIMAL)
      repeat
    }
  }
`;

export const TOGGLE_ACTIVITY_LIKE = `
  mutation ($id: Int) {
    ToggleLikeV2(id: $id, type: ACTIVITY) {
      ... on TextActivity {
        id
        isLiked
        likeCount
      }
      ... on ListActivity {
        id
        isLiked
        likeCount
      }
      ... on MessageActivity {
        id
        isLiked
        likeCount
      }
    }
  }
`;
