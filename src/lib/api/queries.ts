export const GET_VIEWER = `
  query {
    Viewer {
      id
      name
      avatar {
        large
      }
      bannerImage
      options {
        displayAdultContent
        profileColor
      }
    }
  }
`;

export const GET_USER_ANIME_LIST = `
  query ($userId: Int!) {
    MediaListCollection(userId: $userId, type: ANIME, sort: [UPDATED_TIME_DESC]) {
      lists {
        name
        status
        entries {
          id
          progress
          score(format: POINT_10_DECIMAL)
          status
          updatedAt
          repeat
          media {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
            }
            episodes
            nextAiringEpisode {
              episode
              timeUntilAiring
              airingAt
            }
          }
        }
      }
    }
  }
`;

export const SEARCH_ANIME = `
  query ($search: String, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(search: $search, type: ANIME, sort: [POPULARITY_DESC]) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
        }
        description
        averageScore
        episodes
        status
        format
        genres
        nextAiringEpisode {
          episode
          timeUntilAiring
          airingAt
        }
      }
    }
  }
`;

export const GET_ANIME_DETAILS = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        extraLarge
        large
      }
      bannerImage
      description
      averageScore
      meanScore
      episodes
      duration
      status
      format
      genres
      season
      seasonYear
      nextAiringEpisode {
        episode
        timeUntilAiring
        airingAt
      }
      trailer {
        id
        site
      }
      mediaListEntry {
        id
        status
        progress
        score(format: POINT_10_DECIMAL)
        repeat
      }
    }
  }
`;

export const GET_NOTIFICATIONS = `
  query ($page: Int) {
    Page(page: $page, perPage: 20) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
      notifications {
        __typename
        ... on AiringNotification {
          id
          type
          episode
          contexts
          createdAt
          media {
            id
            title { romaji }
            coverImage { large }
          }
        }
        ... on FollowingNotification {
          id
          type
          context
          createdAt
          user {
            id
            name
            avatar { large }
          }
        }
        ... on ActivityMessageNotification {
          id
          type
          context
          createdAt
          activityId
          user {
            id
            name
            avatar { large }
          }
        }
        ... on ActivityReplyNotification {
          id
          type
          context
          createdAt
          activityId
          user {
            id
            name
            avatar { large }
          }
        }
        ... on RelatedMediaAdditionNotification {
          id
          type
          context
          createdAt
          media {
            id
            title { romaji }
            coverImage { large }
          }
        }
        ... on ActivityLikeNotification {
          id
          type
          context
          createdAt
          activityId
          user {
            id
            name
            avatar { large }
          }
        }
        ... on ActivityReplyLikeNotification {
          id
          type
          context
          createdAt
          activityId
          user {
            id
            name
            avatar { large }
          }
        }
      }
    }
  }
`;

export const GET_USER_PROFILE = `
  query ($name: String) {
    User(name: $name) {
      id
      name
      about
      avatar {
        large
      }
      bannerImage
      statistics {
        anime {
          count
          meanScore
          minutesWatched
          episodesWatched
        }
      }
      siteUrl
      createdAt
    }
  }
`;

export const GET_USER_ACTIVITY = `
  query ($userId: Int, $page: Int) {
    Page(page: $page, perPage: 50) {
      activities(userId: $userId, sort: [ID_DESC]) {
        ... on ListActivity {
          createdAt
        }
        ... on TextActivity {
          createdAt
        }
        ... on MessageActivity {
          createdAt
        }
      }
    }
  }
`;

export const GET_ACTIVITY_FEED = `
  query ($userId: Int, $page: Int) {
    Page(page: $page, perPage: 20) {
      pageInfo {
        total
        currentPage
        hasNextPage
      }
      activities(userId: $userId, sort: [ID_DESC]) {
        ... on TextActivity {
          id
          type
          text
          replyCount
          likeCount
          isLiked
          createdAt
          user { id name avatar { large } }
        }
        ... on ListActivity {
          id
          type
          status
          progress
          replyCount
          likeCount
          isLiked
          createdAt
          user { id name avatar { large } }
          media { id title { romaji } coverImage { large } }
        }
        ... on MessageActivity {
          id
          type
          message
          replyCount
          likeCount
          isLiked
          createdAt
          messenger { id name avatar { large } }
        }
      }
    }
  }
`;
