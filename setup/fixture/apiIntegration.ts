export interface ApiIntegrationFixture {
  name: string;
  role: string;
  contentPackageId: string;
}

export function ltiApiIntegrationFixture(
  contentPackageId: string,
): ApiIntegrationFixture {
  return {
    name: 'E2E Tests LTI Api Integration',
    role: 'ROLE_PEARSON_MYREALIZE',
    contentPackageId,
  };
}

export function selectedVideosApiIntegrationFixture(
  contentPackageId: string,
): ApiIntegrationFixture {
  return {
    name: 'E2E Tests Selected Videos API Integration',
    role: 'ROLE_SELECTED_VIDEOS_API_INTEGRATION',
    contentPackageId,
  };
}
