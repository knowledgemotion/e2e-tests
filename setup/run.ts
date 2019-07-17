import { OPERATOR_PASSWORD, OPERATOR_USERNAME, TOKEN_URL } from './Constants';
import { getDisciplines, insertDiscipline } from './disciplineApi';
import {
  getInstructionalVideoFixtures,
  newsVideoFixtures,
  stockVideoFixtures,
} from './fixture/videos';
import { generateToken } from './generateToken';
import { getSubjects, insertSubject } from './subjectApi';
import { findVideos, insertVideo } from './videoApi';

import {
  addVideoToCollection,
  findOneCollectionId,
  getCollections,
  insertCollection,
} from './collectionApi';

import {
  CollectionFixture,
  collectionFixtures,
  ltiCollectionFixture,
} from './fixture/collections';
import { disciplineFixtures } from './fixture/disciplines';
import { subjectFixtures } from './fixture/subjects';

if (!TOKEN_URL || !OPERATOR_USERNAME || !OPERATOR_PASSWORD) {
  throw new Error('Environment variables not set properly.');
}

async function insertVideos(token: string) {
  const videoPromises = await allVideos();

  return Promise.all(
    videoPromises.map(async video => {
      await insertVideo(video, token);
    }),
  );
}

async function insertSubjects(token: string) {
  return Promise.all(
    subjectFixtures.map(subject => insertSubject(subject, token)),
  );
}

async function insertDisciplines(token: string) {
  return Promise.all(
    disciplineFixtures.map(discipline => insertDiscipline(discipline, token)),
  );
}

async function insertCollections(token: string) {
  await Promise.all(
    collectionFixtures.map((collection: CollectionFixture) =>
      insertCollection(collection, token),
    ),
  );
  await insertLtiCollection(token);
}

async function insertLtiCollection(token: string) {
  await insertCollection(ltiCollectionFixture, token);
  const ltiCollectionId = await findOneCollectionId(
    ltiCollectionFixture.title,
    token,
  );
  return findVideos('Minute Physics', token).then(videos => {
    return Promise.all(
      videos.map(video =>
        addVideoToCollection(ltiCollectionId, video.id, token),
      ),
    );
  });
}

async function allVideos() {
  const allInterpolatedVideos = await getInstructionalVideoFixtures();

  return [
    ...allInterpolatedVideos,
    ...stockVideoFixtures,
    ...newsVideoFixtures,
  ];
}

async function setUp() {
  const token = await generateToken();

  const subjects = await getSubjects();
  if (!subjects) {
    await insertSubjects(token);
  } else {
    console.log('Subjects already exist, did not update subjects');
  }

  const disciplines = await getDisciplines(token);
  if (!disciplines) {
    await insertDisciplines(token);
  } else {
    console.log('Disciplines already exist, did not update disciplines');
  }

  console.log('insert all videos');
  await insertVideos(token);

  const collections = await getCollections(token);
  if (!collections) {
    await insertCollections(token);
  } else {
    console.log('Collections already exist, did not update collections');
  }
}

setUp().then(() => {
  console.log('Setup finished');
  process.exit();
});
